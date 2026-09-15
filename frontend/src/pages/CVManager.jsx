import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCv, deleteCv, getCvs } from "../services/cvService";
import Navbar from "../components/layout/Navbar";

export default function CVManager() {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCVName, setNewCVName] = useState("");
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    const loadCvs = async () => {
      try {
        const list = await getCvs();
        setCvList(list || []);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data CV.");
      } finally {
        setLoading(false);
      }
    };
    loadCvs();
  }, []);

  const handleAddCV = (e) => {
    e.preventDefault();
    if (!newCVName) return;

    createCv({ name: targetRole ? `${newCVName} (${targetRole})` : newCVName })
      .then((response) => {
        setCvList((previous) => [response.data, ...previous]);
        setNewCVName("");
        setTargetRole("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Gagal menyimpan CV."),
      );
  };

  const handleDelete = (id) => {
    deleteCv(id)
      .then(() =>
        setCvList((previous) => previous.filter((cv) => cv.id !== id)),
      )
      .catch((err) =>
        setError(err.response?.data?.message || "Gagal menghapus CV."),
      );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-mono">
      <Navbar />
      <main className="max-w-[1600px] mx-auto p-6 pt-24 space-y-6">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
              KELOLA CV & RESUME
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Simpan versi CV terbaik kamu untuk setiap variasi posisi
              pekerjaan.
            </p>
          </div>
          <Link
            to="/"
            className="shrink-0 border border-neutral-400 bg-white px-3 py-2 text-[11px] font-bold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
          >
            ← DASHBOARD
          </Link>
        </div>

        {error && (
          <div className="p-3 border border-red-300 text-red-600 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Add CV */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              + TAMBAH VERSI CV
            </h3>
            <form onSubmit={handleAddCV} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">
                  NAMA FILE / TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: CV_Fullstack_ReactNode.pdf"
                  value={newCVName}
                  onChange={(e) => setNewCVName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              <div>
                <label className="block text-neutral-500 mb-1">
                  TARGET POSISI
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Backend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-black bg-white py-2 font-bold text-black transition hover:bg-black hover:text-white mt-2"
              >
                SIMPAN CV
              </button>
            </form>
          </div>

          {/* List CV */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              DAFTAR RESUME TERSIMPAN ({cvList.length})
            </h3>

            {loading ? (
              <div className="text-xs text-neutral-500">MEMUAT DATA...</div>
            ) : (
              cvList.map((cv, index) => (
                <div
                  key={cv.id}
                  className={`p-4 rounded-xl border flex justify-between items-center transition ${
                    index === 0
                      ? "border-black dark:border-white bg-neutral-100/50 dark:bg-neutral-900"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                        📄 {cv.name}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-white border text-white dark:bg-white dark:text-black rounded">
                          UTAMA
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Diunggah:{" "}
                      {cv.created_at
                        ? new Date(cv.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {index !== 0 && (
                      <button
                        onClick={() =>
                          setCvList((previous) => [
                            cv,
                            ...previous.filter((item) => item.id !== cv.id),
                          ])
                        }
                        className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded text-neutral-700 dark:text-neutral-300"
                      >
                        Set Utama
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="px-2 py-1 text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
