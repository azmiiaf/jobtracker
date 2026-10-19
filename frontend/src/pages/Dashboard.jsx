import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import CreateApplicationModal from "../components/ui/CreateApplicationModal";
import {
  StatsSkeleton,
  TableSkeleton,
  BoardSkeleton,
  GanttSkeleton,
} from "../components/ui/DashboardSkeleton";
import {
  getApplications,
  deleteApplication,
  updateApplication,
} from "../services/applicationService";

const statusBadgeStyles = {
  Applied: "border-blue-500/50 bg-blue-500/10 text-blue-300",
  Interview: "border-yellow-500/50 bg-yellow-500/10 text-yellow-300",
  Offering: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  Offer: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  Offered: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  Diterima: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  Rejected: "border-red-500/50 bg-red-500/10 text-red-300",
  Ditolak: "border-red-500/50 bg-red-500/10 text-red-300",
};

// Helper normalisasi tanggal ke format YYYY-MM-DD tanpa skew timezone
const toDateKey = (dateInput) => {
  if (!dateInput) return "";
  if (typeof dateInput === "string") {
    const datePart = dateInput.split("T")[0].split(" ")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper Generate 14 Hari Kalender Timeline Gantt
const generateTimelineDates = (offsetDays = -6) => {
  const dates = [];
  const today = new Date();

  // Ambil mulai dari offsetDays agar rentang waktu mencakup tanggal apply sebelum dan setelahnya
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + offsetDays);

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const todayKey = toDateKey(today);

  for (let i = 0; i < 14; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateKey = toDateKey(d);
    dates.push({
      fullDate: d,
      dateKey,
      dayName: dayNames[d.getDay()],
      dateLabel: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      isToday: dateKey === todayKey,
    });
  }
  return dates;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID");
};

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Switcher Mode View: 'gantt' (Timeline), 'board', 'table'
  const [viewMode, setViewMode] = useState("table");

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Offset hari timeline (default -6 agar hari ini berada di tengah-tengah rentang 14 hari)
  const [timelineOffset, setTimelineOffset] = useState(-6);

  // 14 Hari Kalender Timeline
  const timelineDates = useMemo(
    () => generateTimelineDates(timelineOffset),
    [timelineOffset],
  );

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplications();
      const list = Array.isArray(data)
        ? data
        : data.applications || data.data || [];
      setApplications(list);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          (app.id || app._id) === id
            ? { ...app, status: newStatus, updated_at: new Date().toISOString() }
            : app,
        ),
      );
    } catch {
      alert("Gagal memperbarui status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await deleteApplication(id);
      setApplications((prev) =>
        prev.filter((app) => (app.id || app._id) !== id),
      );
    } catch {
      alert("Gagal menghapus data.");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const company = (app.company_name || app.company || "").toLowerCase();
      const position = (app.position || app.job_title || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = company.includes(search) || position.includes(search);
      const matchesStatus = statusFilter === "" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Hitung Statistik Card Ringkasan
  const { totalStats, appliedStats, interviewStats, offerStats, rejectedStats } = useMemo(
    () => ({
      totalStats: filteredApplications.length,
      appliedStats: filteredApplications.filter(
        (a) => a.status === "Applied",
      ).length,
      interviewStats: filteredApplications.filter(
        (a) => a.status === "Interview",
      ).length,
      offerStats: filteredApplications.filter((a) =>
        ["Offering", "Offer", "Diterima"].includes(a.status),
      ).length,
      rejectedStats: filteredApplications.filter((a) =>
        ["Rejected", "Ditolak"].includes(a.status),
      ).length,
    }),
    [filteredApplications],
  );

  // Menentukan tanggal mulai: tanggal apply atau tanggal update status
  const getAppStartDate = (app) => {
    // Jika status bukan Applied, prioritaskan tanggal update status
    if (app.status && app.status !== "Applied") {
      // 1. Cek history perubahan status jika ada
      if (app.application_status_history?.length > 0) {
        const matching = app.application_status_history
          .filter((h) => h.status === app.status && h.changed_at)
          .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
        if (matching.length > 0) return matching[0].changed_at;

        const latest = app.application_status_history
          .filter((h) => h.changed_at)
          .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
        if (latest.length > 0) return latest[0].changed_at;
      }

      // 2. Cek updated_at jika status telah diperbarui
      if (app.updated_at) {
        return app.updated_at;
      }
    }

    // Default: tanggal apply atau created_at
    return app.applied_date || app.created_at || new Date().toISOString();
  };

  // Hitung Posisi Gantt Grid Bar berdasarkan tanggal mulai aktual
  const getBarPosition = (startDateStr, status) => {
    if (!timelineDates.length) return { gridStart: 2, gridEnd: 8, isVisible: true };

    const firstDateKey = timelineDates[0].dateKey;
    const targetDateKey = toDateKey(startDateStr);

    const startObj = new Date(targetDateKey + "T00:00:00");
    const firstObj = new Date(firstDateKey + "T00:00:00");

    let durationDays = 6;
    if (["Offering", "Offer", "Diterima"].includes(status)) {
      durationDays = 7;
    } else if (status === "Interview") {
      durationDays = 5;
    } else if (status === "Rejected" || status === "Ditolak") {
      durationDays = 3;
    }

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((startObj.getTime() - firstObj.getTime()) / ONE_DAY_MS);

    // Jika mulai setelah rentang tanggal yang sedang ditampilkan
    if (diffDays >= timelineDates.length) {
      return { gridStart: 0, gridEnd: 0, isVisible: false };
    }

    // Jika mulai sebelum rentang tanggal yang sedang ditampilkan
    if (diffDays < 0) {
      const remainingDuration = durationDays + diffDays;
      const isOngoing = !["Offering", "Offer", "Diterima", "Rejected", "Ditolak"].includes(status);
      if (remainingDuration <= 0 && !isOngoing) {
        return { gridStart: 0, gridEnd: 0, isVisible: false };
      }
      const gridStart = 2; // Mulai dari kolom tanggal pertama
      const gridEnd = Math.min(gridStart + Math.max(1, remainingDuration), 16);
      return { gridStart, gridEnd, isVisible: true };
    }

    // Berada di dalam rentang timeline
    const gridStart = diffDays + 2; // +2 karena Kolom 1 = NAMA TUGAS
    const gridEnd = Math.min(gridStart + durationDays, 16);

    return { gridStart, gridEnd, isVisible: true };
  };

  return (
    <div className="dashboard-light h-screen max-h-screen flex flex-col bg-neutral-50 text-neutral-900 select-none overflow-hidden">
      <Navbar />

      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 pt-20 pb-4 flex-1 flex flex-col min-h-0 gap-4 overflow-hidden">
        {/* ================= CARD RINGKASAN STATISTIK ================= */}
        <div className="shrink-0">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
              <div className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center">
                <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                  TOTAL TUGAS / LAMARAN
                </p>
                <p className="text-2xl font-bold font-mono text-white">{totalStats}</p>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center">
                <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                  IN PROGRESS (APPLIED)
                </p>
                <p className="text-2xl font-bold font-mono text-blue-400">{appliedStats}</p>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center">
                <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                  TAHAP INTERVIEW
                </p>
                <p className="text-2xl font-bold font-mono text-yellow-400">
                  {interviewStats}
                </p>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center">
                <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                  SELESAI (OFFER)
                </p>
                <p className="text-2xl font-bold font-mono text-emerald-400">{offerStats}</p>
              </div>
              <div className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center">
                <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-1">
                  DITOLAK
                </p>
                <p className="text-2xl font-bold font-mono text-red-400">{rejectedStats}</p>
              </div>
            </div>
          )}
        </div>

        {/* TOOLBAR PENCARIAN, FILTER, SWITCHER & BTN TAMBAH */}
        <div className="shrink-0 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="Cari tugas / perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black placeholder:text-neutral-500"
            />
            <select
              value={statusFilter}
              style={{fontSize: '.6rem'}}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-neutral-900 focus:outline-none focus:border-black uppercase font-bold"
            >
              <option value="">SEMUA STATUS</option>
              <option value="Applied">APPLIED</option>
              <option value="Interview">INTERVIEW</option>
              <option value="Offering">OFFER</option>
              <option value="Rejected">REJECTED</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex bg-white border border-neutral-300 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewMode === "table"
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                📋 TABEL
              </button>
              <button
                onClick={() => setViewMode("gantt")}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewMode === "gantt"
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                📊 TIMELINE PROYEK
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`px-3 py-1.5 rounded-md transition ${
                  viewMode === "board"
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                🗂️ BOARD
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              style={{ fontSize: ".7rem" }}
              className="px-3.5 py-2 bg-black text-white font-bold rounded-lg hover:bg-neutral-800 transition cursor-pointer whitespace-nowrap uppercase tracking-wider"
            >
              + TAMBAH TUGAS
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* ================= MODE 1: GANTT CHART (GRID TIMELINE PROYEK) ================= */}
        {viewMode === "gantt" &&
          (loading ? (
            <div className="flex-1 min-h-0">
              <GanttSkeleton />
            </div>
          ) : (
            <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 overflow-hidden flex-1 min-h-0 flex flex-col">
            {/* Header + Legend + Navigator */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Timeline Proyek
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Visualisasi jadwal tugas dan durasi
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                {/* Navigator Rentang Tanggal */}
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-1 font-bold">
                  <button
                    onClick={() => setTimelineOffset((prev) => prev - 7)}
                    title="Geser 7 hari ke belakang"
                    className="px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition"
                  >
                    ← 7 Hari
                  </button>
                  <button
                    onClick={() => setTimelineOffset(-6)}
                    className="px-2.5 py-1 text-neutral-200 hover:text-white bg-neutral-800 rounded transition text-[11px]"
                  >
                    Hari Ini
                  </button>
                  <button
                    onClick={() => setTimelineOffset((prev) => prev + 7)}
                    title="Geser 7 hari ke depan"
                    className="px-2.5 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition"
                  >
                    7 Hari →
                  </button>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 font-bold tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm shadow-blue-500"></span>
                    <span className="text-neutral-300">IN PROGRESS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500"></span>
                    <span className="text-neutral-300">SELESAI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500"></span>
                    <span className="text-neutral-300">CLOSED</span>
                  </div>
                </div>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 text-xs flex-1 flex items-center justify-center">
                Belum ada data tugas.
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto border border-neutral-800 rounded-xl bg-neutral-950 flex-1 min-h-0">
                <div className="min-w-[1200px]">
                  {/* Grid Header Tanggal */}
                  <div className="grid grid-cols-[220px_repeat(14,minmax(80px,1fr))] border-b border-neutral-800 bg-[#121212]">
                    <div className="p-3 text-[11px] font-extrabold text-neutral-300 uppercase tracking-wider flex items-center border-r border-neutral-800">
                      NAMA TUGAS
                    </div>
                    {timelineDates.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 text-center border-r border-neutral-800/80 last:border-r-0 flex flex-col justify-center items-center transition-colors ${
                          item.isToday
                            ? "bg-blue-500/10 border-b-2 border-b-blue-500"
                            : ""
                        }`}
                      >
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          item.isToday ? "text-blue-400" : "text-neutral-400"
                        }`}>
                          {item.dayName}
                        </span>
                        <span className={`text-xs font-bold mt-0.5 ${
                          item.isToday ? "text-blue-300 font-extrabold" : "text-white"
                        }`}>
                          {item.dateLabel}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Grid Rows Data */}
                  <div className="divide-y divide-neutral-800/80">
                    {filteredApplications.map((app) => {
                      const appId = app.id || app._id;
                      const taskName =
                        app.company_name ||
                        app.company ||
                        app.position ||
                        "Tugas Baru";
                      const status = app.status || "Applied";
                      const startDateStr = getAppStartDate(app);
                      const { gridStart, gridEnd, isVisible } = getBarPosition(
                        startDateStr,
                        status,
                      );

                      const isDone = ["Offering", "Offer", "Diterima"].includes(
                        status,
                      );
                      const isRejected =
                        status === "Rejected" || status === "Ditolak";
                      let barStyle =
                        "bg-[#0f2847] border-blue-500 text-blue-200";
                      let statusLabel = "Running";

                      if (isDone) {
                        barStyle =
                          "bg-[#0b3321] border-emerald-500 text-emerald-200";
                        statusLabel = "Selesai";
                      } else if (isRejected) {
                        barStyle = "bg-[#381111] border-red-500 text-red-200";
                        statusLabel = "Closed";
                      }

                      return (
                        <div
                          key={appId}
                          className="grid grid-cols-[220px_repeat(14,minmax(80px,1fr))] relative items-center hover:bg-neutral-900/40 transition"
                        >
                          <div className="p-4 text-xs font-semibold text-neutral-200 border-r border-neutral-800 truncate z-10 bg-neutral-950 h-full flex items-center">
                            {taskName}
                          </div>

                          {timelineDates.map((_, colIdx) => (
                            <div
                              key={colIdx}
                              className="h-14 border-r border-neutral-800/40 last:border-r-0"
                            ></div>
                          ))}

                          {isVisible ? (
                            <div
                              style={{
                                gridColumnStart: gridStart,
                                gridColumnEnd: gridEnd,
                              }}
                              className={`absolute left-1 right-1 h-9 rounded-xl border ${barStyle} px-3 flex items-center shadow-lg transition-all duration-300 z-0`}
                            >
                              <span className="text-[11px] font-semibold tracking-wide truncate">
                                {statusLabel} • {formatDate(startDateStr)}
                              </span>
                            </div>
                          ) : (
                            <div className="absolute left-[228px] text-[10px] text-neutral-500 font-mono italic pointer-events-none">
                              (Mulai: {formatDate(startDateStr)})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ================= MODE 2: KANBAN BOARD ================= */}
        {viewMode === "board" &&
          (loading ? (
            <div className="flex-1 min-h-0">
              <BoardSkeleton />
            </div>
          ) : (
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {["Applied", "Interview", "Offer", "Rejected"].map((colKey) => {
              const itemsInCol = filteredApplications.filter((app) => {
                if (colKey === "Offering")
                  return ["Offering", "Offer", "Diterima"].includes(app.status);
                if (colKey === "Rejected")
                  return app.status === "Rejected" || app.status === "Ditolak";
                return app.status === colKey;
              });

              return (
                <div
                  key={colKey}
                  className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-4 flex flex-col h-full max-h-full min-h-0"
                >
                  <div className="flex justify-between items-center pb-3 mb-3 border-b border-neutral-800">
                    <h3 className="font-bold text-xs tracking-wider text-white uppercase">
                      {colKey}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded font-bold border border-neutral-700">
                      {itemsInCol.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {itemsInCol.length === 0 ? (
                      <div className="h-28 flex items-center justify-center border border-dashed border-neutral-800/80 rounded-lg text-neutral-600 text-[11px]">
                        Kosong
                      </div>
                    ) : (
                      itemsInCol.map((app) => {
                        const appId = app.id || app._id;
                        return (
                          <div
                            key={appId}
                            className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-lg space-y-3"
                          >
                            <div>
                              <div className="font-bold text-white text-xs">
                                {app.company_name || app.company}
                              </div>
                              <div className="text-neutral-400 text-[11px]">
                                {app.position || app.job_title}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-neutral-900 flex justify-between items-center">
                              <select
                                value={app.status || "Applied"}
                                onChange={(e) =>
                                  handleStatusChange(appId, e.target.value)
                                }
                                className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] rounded px-1.5 py-1 uppercase focus:outline-none"
                              >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offering">Offer</option>
                                <option value="Rejected">Rejected</option>
                              </select>

                              <button
                                onClick={() => handleDelete(appId)}
                                className="px-2 py-1 bg-red-950/60 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white text-[10px] rounded transition"
                              >
                                ✕ Hapus
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* ================= MODE 3: TABEL DETAIL ================= */}
        {viewMode === "table" &&
          (loading ? (
            <div className="flex-1 min-h-0">
              <TableSkeleton />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex-1 min-h-0 bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl p-8 flex items-center justify-center text-center text-neutral-500 text-xs">
              Belum ada data lamaran.
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[720px]">
                  <thead className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase font-bold text-[10px] tracking-wider shadow-sm">
                    <tr>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Perusahaan / Tugas</th>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Posisi</th>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Lokasi</th>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Work Type</th>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Tanggal Apply</th>
                      <th className="py-3 px-4 bg-neutral-950 sticky top-0">Status</th>
                      <th className="py-3 px-4 text-right bg-neutral-950 sticky top-0">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredApplications.map((app) => {
                      const appId = app.id || app._id;
                      const company = app.company_name || app.company || "-";
                      const position = app.position || app.job_title || "-";
                      const location = app.location || "-";
                      const workType = app.work_type || "On-Site";
                      const appliedDate = formatDate(app.applied_date);
                      return (
                        <tr
                          key={appId}
                          onClick={() => navigate(`/applications/${appId}`)}
                          className="hover:bg-neutral-900/40 transition cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-bold text-white">
                            {company}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-700">
                            <div>{position}</div>
                            {app.job_type && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {app.job_type}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">
                            {location}
                          </td>
                           <td className="py-3.5 px-4 text-neutral-600">
                             {workType}
                           </td>
                           <td className="py-3.5 px-4 text-neutral-600">
                             {appliedDate}
                           </td>
                           <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex min-w-[92px] justify-center border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeStyles[app.status] || statusBadgeStyles.Applied}`}
                            >
                              {app.status || "Applied"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(appId);
                              }}
                              className="text-red-500 hover:text-red-400 text-xs font-bold transition"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </main>

      {/* MODAL TAMBAH TUGAS */}
      <CreateApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchApplications()}
      />
    </div>
  );
}
