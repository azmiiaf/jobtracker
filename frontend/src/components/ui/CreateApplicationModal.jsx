import { useState } from "react";
import { useEffect } from "react";
import { createApplication, getCvs } from "../../services/applicationService";

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

export default function CreateApplicationModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    location: "",
    job_type: "Full Time",
    source: "LinkedIn",
    job_url: "",
    applied_date: new Date().toISOString().split("T")[0],
    cv_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cvList, setCvList] = useState([]);
  const [customSources, setCustomSources] = useState(getCustomSources);
  const [customSource, setCustomSource] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    getCvs()
      .then((response) => setCvList(response.data || []))
      .catch(() => setCvList([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    setLoading(true);

    const source =
      formData.source === "Other" ? customSource.trim() : formData.source;
    if (!source) {
      setErrorMessage("Isi nama platform jika memilih Other.");
      setLoading(false);
      return;
    }

    const payload = {
      company_name: formData.company_name,
      position: formData.position,
      location: formData.location,
      work_type: formData.job_type,
      job_url: formData.job_url,
      source,
      status: "Applied",
      applied_date: formData.applied_date,
      cv_id: formData.cv_id || null,
    };

    try {
      await createApplication(payload);
      if (!builtInSources.includes(source) && !customSources.includes(source)) {
        const nextSources = [...customSources, source];
        setCustomSources(nextSources);
        localStorage.setItem(
          "jobtracker_custom_sources",
          JSON.stringify(nextSources),
        );
      }
      onSuccess();
      onClose();
      setFormData({
        company_name: "",
        position: "",
        location: "",
        job_type: "Full Time",
        source: "LinkedIn",
        job_url: "",
        applied_date: new Date().toISOString().split("T")[0],
        cv_id: "",
      });
      setCustomSource("");
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err);
      const serverMsg =
        err.response?.data?.error || err.response?.data?.message;
      setErrorMessage(
        typeof serverMsg === "object"
          ? JSON.stringify(serverMsg)
          : serverMsg || "Gagal menyimpan data.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 font-mono text-white shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-800">
          <h3 className="text-sm font-bold tracking-wider text-white">
            + TAMBAH LAMARAN BARU
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black transition text-lg"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-400 text-xs rounded break-words">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 text-neutral-400 font-bold uppercase">
              Perusahaan *
            </label>
            <input
              type="text"
              name="company_name"
              required
              placeholder="Contoh: PT Armstrong Industri Indonesia"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-neutral-400 font-bold uppercase">
              Posisi *
            </label>
            <input
              type="text"
              name="position"
              required
              placeholder="Contoh: Web Developer"
              value={formData.position}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-neutral-400 font-bold uppercase">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                placeholder="Cikarang Selatan"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-neutral-400 font-bold uppercase">
                Tipe Kerja
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-neutral-400 font-bold uppercase">
              Sumber Lamaran *
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Jobstreet">Jobstreet</option>
              <option value="Glints">Glints</option>
              <option value="Kalibrr">Kalibrr</option>
              <option value="Company Website">Company Website</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
              {customSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            {formData.source === "Other" && (
              <input
                type="text"
                value={customSource}
                onChange={(event) => setCustomSource(event.target.value)}
                placeholder="Ketik nama platform..."
                required
                className="mt-2 w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-neutral-400 font-bold uppercase">
              Link Postingan / Source
            </label>
            <input
              type="text"
              name="job_url"
              placeholder="https://linkedin.com/in/..."
              value={formData.job_url}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-neutral-400 font-bold uppercase">
                Tanggal Apply *
              </label>
              <input
                type="date"
                name="applied_date"
                required
                value={formData.applied_date}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-neutral-400 font-bold uppercase">
                CV yang Dipakai
              </label>
              <select
                name="cv_id"
                value={formData.cv_id}
                onChange={handleChange}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
              >
                <option value="">Tidak dipilih</option>
                {cvList.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 rounded font-bold transition"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-bold rounded transition disabled:opacity-50"
            >
              {loading ? "MENYIMPAN..." : "SIMPAN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
