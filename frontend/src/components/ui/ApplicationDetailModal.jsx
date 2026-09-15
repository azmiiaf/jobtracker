import { useState, useEffect } from "react";
import {
  getApplicationById,
  getCvs,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../../services/applicationService";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID");
};

const getInterview = (application) => {
  if (Array.isArray(application?.interviews)) return application.interviews[0];
  return application?.interviews;
};

const getStatusHistory = (application) => {
  if (application?.status_history?.length) return application.status_history;
  if (!application?.status) return [];
  return [{ status: application.status, changed_at: application.applied_date }];
};

const builtInSources = [
  "LinkedIn",
  "Jobstreet",
  "Glints",
  "Kalibrr",
  "Company Website",
  "Referral",
  "Other",
];

const getCustomSources = () => {
  try {
    return JSON.parse(
      localStorage.getItem("jobtracker_custom_sources") || "[]",
    );
  } catch {
    return [];
  }
};

function StatusEditor({
  statusValue,
  setStatusValue,
  statusNote,
  setStatusNote,
  statusDate,
  setStatusDate,
  updateError,
  updating,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 border-t border-neutral-200 pt-5"
    >
      <span className="block text-xs font-mono font-bold uppercase text-neutral-500">
        UBAH STATUS
      </span>
      {updateError && (
        <p className="border border-red-300 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">
          {updateError}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={statusValue}
          onChange={(event) => setStatusValue(event.target.value)}
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offering">Offering</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          value={statusNote}
          onChange={(event) => setStatusNote(event.target.value)}
          placeholder="Catatan status (opsional)"
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-black"
        />
        <input
          type="date"
          required
          value={statusDate}
          onChange={(event) => setStatusDate(event.target.value)}
          className="w-full border border-neutral-400 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
        />
      </div>
      <button
        type="submit"
        disabled={updating}
        className="border border-black bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
      >
        {updating ? "MENYIMPAN..." : "SIMPAN PERUBAHAN STATUS"}
      </button>
    </form>
  );
}

export default function ApplicationDetailModal({
  applicationId,
  application,
  isOpen,
  page = false,
  onClose,
  onRefresh,
}) {
  const [data, setData] = useState(application || null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [cvOptions, setCvOptions] = useState([]);
  const [customSources, setCustomSources] = useState(getCustomSources);
  const [editCustomSource, setEditCustomSource] = useState("");
  const [editForm, setEditForm] = useState({});
  const [statusValue, setStatusValue] = useState(
    application?.status || "Applied",
  );
  const [statusNote, setStatusNote] = useState("");
  const [statusDate, setStatusDate] = useState(
    application?.applied_date?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (!isOpen || !applicationId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getApplicationById(applicationId);
        const detail = res.data?.data || res.data;
        setData(detail);
        setEditForm({
          company_name: detail.company_name || "",
          position: detail.position || "",
          location: detail.location || "",
          work_type: detail.work_type || "Full Time",
          applied_date: detail.applied_date?.split("T")[0] || "",
          source: detail.source || "Other",
          cv_id: detail.cv_id || detail.cvs?.id || "",
          job_url: detail.job_url || "",
        });
        setEditCustomSource(
          detail.source && !builtInSources.includes(detail.source)
            ? detail.source
            : "",
        );
        setStatusValue(detail.status || "Applied");
        setStatusDate(
          detail.applied_date?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
        );
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    getCvs()
      .then((response) =>
        setCvOptions(Array.isArray(response.data) ? response.data : []),
      )
      .catch(() => setCvOptions([]));
  }, [isOpen, applicationId, application]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditSave = async (event) => {
    event.preventDefault();
    try {
      setEditSaving(true);
      setEditError("");
      const source =
        editForm.source === "Other" ? editCustomSource.trim() : editForm.source;
      if (!source) {
        setEditError("Isi nama platform jika memilih Other.");
        return;
      }
      await updateApplication(applicationId, { ...editForm, source });
      if (!builtInSources.includes(source) && !customSources.includes(source)) {
        const nextSources = [...customSources, source];
        setCustomSources(nextSources);
        localStorage.setItem(
          "jobtracker_custom_sources",
          JSON.stringify(nextSources),
        );
      }
      const response = await getApplicationById(applicationId);
      setData(response.data?.data || response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan data lamaran:", error);
      setEditError(
        error.response?.data?.message || "Gagal menyimpan data lamaran",
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleStatusChange = async (event) => {
    event.preventDefault();
    try {
      setUpdating(true);
      setUpdateError("");
      const response = await updateApplicationStatus(applicationId, {
        status: statusValue,
        note: statusNote,
        status_date: statusDate,
      });
      const nextHistory = {
        id: `local-${Date.now()}`,
        status: statusValue,
        note: statusNote,
        changed_at: `${statusDate}T12:00:00`,
      };
      setData((prev) => ({
        ...prev,
        status: response.data?.status || statusValue,
        status_history: [...(prev.status_history || []), nextHistory],
      }));
      setStatusNote("");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      setUpdateError(
        error.response?.data?.message || "Gagal memperbarui status",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus lamaran ini?")) return;
    try {
      await deleteApplication(applicationId);
      if (onRefresh) onRefresh();
      onClose();
    } catch {
      alert("Gagal menghapus lamaran");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={
        page
          ? "min-h-screen bg-white px-4 pb-8 pt-24 text-neutral-900 sm:px-8"
          : "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      }
    >
      <div
        className={
          page
            ? "mx-auto w-full max-w-6xl space-y-6 bg-white"
            : "w-full max-w-lg space-y-6 rounded-xl border border-neutral-300 bg-white p-6 text-neutral-900 shadow-2xl"
        }
      >
        {/* Header Modal */}
        <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              DETAIL LAMARAN
            </span>
            <h3 className="text-xl font-bold font-mono uppercase">
              {data?.position || "Loading..."}
            </h3>
            <p className="text-sm font-semibold text-neutral-500">
              {data?.company_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:border-black hover:text-black"
          >
            {page ? "← KEMBALI" : "✕"}
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-400">
            MEMUAT DATA...
          </div>
        ) : (
          <>
            <div
              className={
                page
                  ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]"
                  : "space-y-6"
              }
            >
              <div className="space-y-5">
                {isEditing ? (
                  <form
                    onSubmit={handleEditSave}
                    className="space-y-4 border border-neutral-200 bg-neutral-50 p-4 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-neutral-700">
                        EDIT DATA LAMARAN
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-neutral-500 underline"
                      >
                        BATAL
                      </button>
                    </div>
                    {editError && (
                      <p className="border border-red-300 bg-red-50 px-3 py-2 font-bold text-red-700">
                        {editError}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="space-y-1">
                        <span className="block text-neutral-500">
                          PERUSAHAAN
                        </span>
                        <input
                          name="company_name"
                          value={editForm.company_name || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">POSISI</span>
                        <input
                          name="position"
                          value={editForm.position || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">LOKASI</span>
                        <input
                          name="location"
                          value={editForm.location || ""}
                          onChange={handleEditChange}
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">
                          TIPE KERJA
                        </span>
                        <select
                          name="work_type"
                          value={editForm.work_type || "Full Time"}
                          onChange={handleEditChange}
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        >
                          <option>Full Time</option>
                          <option>Part Time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                          <option>Remote</option>
                        </select>
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">
                          TANGGAL APPLY
                        </span>
                        <input
                          type="date"
                          name="applied_date"
                          value={editForm.applied_date || ""}
                          onChange={handleEditChange}
                          required
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">PLATFORM</span>
                        <select
                          name="source"
                          value={editForm.source || "Other"}
                          onChange={handleEditChange}
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        >
                          <option>LinkedIn</option>
                          <option>Jobstreet</option>
                          <option>Glints</option>
                          <option>Kalibrr</option>
                          <option>Company Website</option>
                          <option>Referral</option>
                          <option>Other</option>
                          {customSources.map((source) => (
                            <option key={source} value={source}>
                              {source}
                            </option>
                          ))}
                        </select>
                        {editForm.source === "Other" && (
                          <input
                            type="text"
                            value={editCustomSource}
                            onChange={(event) =>
                              setEditCustomSource(event.target.value)
                            }
                            placeholder="Ketik nama platform..."
                            required
                            className="mt-2 w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                          />
                        )}
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">
                          CV YANG DIPAKAI
                        </span>
                        <select
                          name="cv_id"
                          value={editForm.cv_id || ""}
                          onChange={handleEditChange}
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        >
                          <option value="">Tidak dipilih</option>
                          {cvOptions.map((cv) => (
                            <option key={cv.id} value={cv.id}>
                              {cv.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1">
                        <span className="block text-neutral-500">
                          LINK POSTINGAN
                        </span>
                        <input
                          type="url"
                          name="job_url"
                          value={editForm.job_url || ""}
                          onChange={handleEditChange}
                          className="w-full border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-black"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={editSaving}
                      className="border border-black bg-black px-4 py-2 font-bold uppercase text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {editSaving ? "MENYIMPAN..." : "SIMPAN DATA"}
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="border border-neutral-400 bg-white px-3 py-2 text-[11px] font-bold uppercase text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                      >
                        EDIT DATA
                      </button>
                    </div>
                    {/* Info Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          LOKASI
                        </span>
                        <span className="font-bold">
                          {data?.location || "-"}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          TIPE KERJA
                        </span>
                        <span className="font-bold">
                          {data?.work_type || "-"}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          TANGGAL APPLY
                        </span>
                        <span className="font-bold">
                          {formatDate(data?.applied_date)}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          TANGGAL INTERVIEW
                        </span>
                        <span className="font-bold">
                          {formatDate(getInterview(data)?.interview_date)}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          SUMBER LAMARAN
                        </span>
                        <span className="font-bold">{data?.source || "-"}</span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded border border-neutral-200">
                        <span className="text-neutral-400 block mb-1">
                          CV YANG DIPAKAI
                        </span>
                        <span className="font-bold">
                          {data?.cvs?.name || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Link Job Source */}
                    {data?.job_url && (
                      <div className="text-xs font-mono">
                        <span className="text-neutral-400 block mb-1">
                          LINK POSTINGAN
                        </span>
                        <a
                          href={data.job_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-black underline break-all font-semibold hover:opacity-80"
                        >
                          {data.job_url} ↗
                        </a>
                      </div>
                    )}
                  </>
                )}
                <StatusEditor
                  statusValue={statusValue}
                  setStatusValue={setStatusValue}
                  statusNote={statusNote}
                  setStatusNote={setStatusNote}
                  statusDate={statusDate}
                  setStatusDate={setStatusDate}
                  updateError={updateError}
                  updating={updating}
                  onSubmit={handleStatusChange}
                />
              </div>

              <div className="space-y-5">
                <section className="space-y-3 border-t border-neutral-200 pt-5 md:border-t-0 md:border-l md:pl-6">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-500">
                    RIWAYAT STATUS
                  </span>
                  <div className="relative space-y-4 border-l border-neutral-300 pl-5">
                    {getStatusHistory(data).map((history, index) => (
                      <div
                        key={history.id || `${history.status}-${index}`}
                        className="relative"
                      >
                        <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-black" />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase text-neutral-900">
                              {history.status === "Offering"
                                ? "Offer"
                                : history.status}
                            </p>
                            {history.note && (
                              <p className="mt-1 text-[11px] text-neutral-500">
                                {history.note}
                              </p>
                            )}
                          </div>
                          <time className="whitespace-nowrap text-[10px] text-neutral-400">
                            {formatDate(history.changed_at)}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
              <button
                onClick={handleDelete}
                className="text-xs font-mono text-red-600 hover:underline font-bold"
              >
                [Hapus Lamaran]
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
