const supabase = require("../config/db");

const applicationFields = [
  "company_name",
  "position",
  "job_url",
  "description",
  "location",
  "work_type",
  "salary_min",
  "salary_max",
  "source",
  "applied_date",
  "status",
  "cv_id",
  "notes",
];
const pickApplicationFields = (body) => {
  const payload = {};
  for (const field of applicationFields) {
    if (body[field] !== undefined && body[field] !== "")
      payload[field] = body[field];
  }
  if (body.job_type && !payload.work_type) payload.work_type = body.job_type;
  if (body.link && !payload.job_url) payload.job_url = body.link;
  return payload;
};

const normalizeStatus = (status) => {
  if (status === "Offer" || status === "Offered" || status === "Diterima") {
    return "Offering";
  }
  return status;
};

const getHistoryTimestamp = (statusDate) => {
  if (!statusDate) return new Date().toISOString();
  const date = new Date(`${statusDate}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
};

const getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, cvs(id, name), interviews(interview_date, interview_time)")
      .eq("user_id", req.user.id)
      .order("applied_date", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Gagal mengambil lamaran:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data lamaran" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, cvs(id, name)")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Lamaran tidak ditemukan" });
    const [interviewsResult, historyResult] = await Promise.all([
      supabase
        .from("interviews")
        .select("id, interview_date, interview_time, type, location, notes")
        .eq("application_id", req.params.id)
        .order("interview_date", { ascending: false }),
      supabase
        .from("application_status_history")
        .select("id, status, note, changed_at")
        .eq("application_id", req.params.id)
        .order("changed_at", { ascending: true }),
    ]);

    data.interviews = interviewsResult.error ? [] : interviewsResult.data || [];
    data.status_history = historyResult.error ? [] : historyResult.data || [];

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Gagal mengambil detail lamaran:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail lamaran" });
  }
};

const createApplication = async (req, res) => {
  const payload = pickApplicationFields(req.body);
  if (!payload.company_name || !payload.position) {
    return res
      .status(400)
      .json({ success: false, message: "Perusahaan dan posisi wajib diisi" });
  }

  try {
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          ...payload,
          user_id: req.user.id,
          source: payload.source?.trim() || "Other",
          status: normalizeStatus(payload.status || "Applied"),
        },
      ])
      .select("*, cvs(id, name), interviews(interview_date, interview_time)")
      .single();

    if (error) throw error;
    const { error: historyError } = await supabase
      .from("application_status_history")
      .insert([
        {
          application_id: data.id,
          status: data.status,
          changed_at: getHistoryTimestamp(req.body.status_date),
        },
      ]);
    if (historyError)
      console.error("Gagal mencatat history status:", historyError.message);

    return res
      .status(201)
      .json({ success: true, message: "Berhasil menambah lamaran", data });
  } catch (error) {
    console.error("Gagal menambah lamaran:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateApplication = async (req, res) => {
  const payload = pickApplicationFields(req.body);
  if (payload.status) payload.status = normalizeStatus(payload.status);
  if (!Object.keys(payload).length) {
    return res
      .status(400)
      .json({ success: false, message: "Tidak ada data yang diperbarui" });
  }

  try {
    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select("id, status")
      .maybeSingle();

    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Lamaran tidak ditemukan" });
    if (payload.status) {
      const { error: historyError } = await supabase
        .from("application_status_history")
        .insert([
          {
            application_id: data.id,
            status: data.status,
            note: req.body.note || null,
            changed_at: getHistoryTimestamp(req.body.status_date),
          },
        ]);
      if (historyError)
        console.error("Gagal mencatat history status:", historyError.message);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Gagal memperbarui lamaran:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateApplicationInterview = async (req, res) => {
  const { interview_date, interview_time } = req.body;

  if (!interview_date) {
    return res.status(400).json({
      success: false,
      message: "Tanggal interview wajib diisi",
    });
  }

  try {
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .select("id")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (applicationError) throw applicationError;
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Lamaran tidak ditemukan" });
    }

    const { data: existingInterview, error: findError } = await supabase
      .from("interviews")
      .select("id")
      .eq("application_id", req.params.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    const interviewPayload = {
      application_id: req.params.id,
      interview_date,
      interview_time: interview_time || null,
    };

    const query = existingInterview
      ? supabase
          .from("interviews")
          .update(interviewPayload)
          .eq("id", existingInterview.id)
      : supabase.from("interviews").insert([interviewPayload]);
    const { data, error } = await query.select().single();

    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Gagal menyimpan jadwal interview:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateApplicationStatus = (req, res) => updateApplication(req, res);

const deleteApplication = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Lamaran tidak ditemukan" });
    return res
      .status(200)
      .json({ success: true, message: "Lamaran berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus lamaran:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  updateApplicationInterview,
  deleteApplication,
};
