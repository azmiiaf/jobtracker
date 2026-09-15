import { useMemo } from 'react';

export default function TimeLineGantt({ applications = [], onSelectApp, onSelectApplication }) {
  const handleSelect = onSelectApp || onSelectApplication;

  // Rentang 8 hari (3 hari lalu s.d. 4 hari ke depan)
  const timelineDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const dayNames = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    for (let i = -3; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
        monthName: monthNames[d.getMonth()],
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  const getDaysAgo = (dateString) => {
    if (!dateString) return 0;
    const dateVal = new Date(dateString);
    if (isNaN(dateVal.getTime())) return 0;
    const diff = Math.abs(new Date() - dateVal);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getValidDateStr = (dateString) => {
    if (!dateString) return '';
    const dateVal = new Date(dateString);
    return isNaN(dateVal.getTime()) ? '' : dateVal.toISOString().split('T')[0];
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 border border-neutral-800 rounded-xl p-6 font-sans">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">Timeline Proyek & Lamaran</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Visualisasi jadwal, durasi, dan indikasi penumpukan proses (bottleneck)
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Tabel Tanggal */}
          <div className="grid grid-cols-12 border-b border-neutral-800 text-center text-xs font-semibold">
            <div className="col-span-4 p-3 text-left border-r border-neutral-800 text-neutral-400 uppercase tracking-wider font-mono">
              Nama Tugas / Perusahaan
            </div>
            <div className="col-span-8 grid grid-cols-8 divide-x divide-neutral-800 font-mono">
              {timelineDates.map((date, idx) => (
                <div
                  key={idx}
                  className={`p-2 flex flex-col justify-center items-center ${
                    date.isToday ? 'bg-neutral-900/80 text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  <span className="text-[10px] uppercase">{date.dayName}</span>
                  <span className="text-xs text-neutral-200">
                    {date.dayNum} {date.monthName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Baris Lamaran / Tugas */}
          <div className="divide-y divide-neutral-800/60">
            {applications.length > 0 ? (
              applications.map((app) => {
                const dateVal = app.created_at || app.applied_date;
                const daysInProcess = getDaysAgo(dateVal);
                const isBottleneck =
                  (app.status?.toLowerCase() === 'applied' || app.status?.toLowerCase() === 'interview') &&
                  daysInProcess > 14;

                const appDateStr = getValidDateStr(dateVal);
                let startIndex = timelineDates.findIndex((d) => d.fullDate === appDateStr);
                if (startIndex === -1) startIndex = 3;

                return (
                  <div
                    key={app.id || app._id}
                    onClick={() => handleSelect && handleSelect(app.id || app._id)}
                    className="grid grid-cols-12 items-center hover:bg-neutral-900/50 transition cursor-pointer group"
                  >
                    {/* Y-Axis: Perusahaan & Posisi */}
                    <div className="col-span-4 p-4 border-r border-neutral-800 pr-3">
                      <div className="font-semibold text-sm text-neutral-200 group-hover:text-white transition">
                        {app.company_name}
                      </div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">
                        {app.position}
                      </div>
                    </div>

                    {/* X-Axis: Baris Grid Timeline */}
                    <div className="col-span-8 grid grid-cols-8 relative h-14 items-center px-1">
                      {/* Grid Background Lines */}
                      {timelineDates.map((_, i) => (
                        <div key={i} className="h-full border-r border-neutral-800/40" />
                      ))}

                      {/* Baris Status Durasi (Gantt Bar) */}
                      <div
                        className="absolute h-8 rounded-md flex items-center px-3 text-xs font-mono font-medium shadow-lg transition-all"
                        style={{
                          left: `${(startIndex * 100) / 8 + 1}%`,
                          width: `${Math.min(((8 - startIndex) * 100) / 8 - 2, 70)}%`,
                          backgroundColor: isBottleneck ? '#262626' : '#1e3a8a',
                          border: isBottleneck ? '1px solid #dc2626' : '1px solid #3b82f6',
                          color: isBottleneck ? '#f87171' : '#93c5fd',
                        }}
                      >
                        <div className="flex justify-between items-center w-full truncate">
                          <span className="truncate font-bold">
                            {app.status || 'Running'}
                          </span>
                          <span className="text-[10px] opacity-80 ml-2 whitespace-nowrap">
                            {isBottleneck ? `⚠️ ${daysInProcess}d (Stuck)` : `${daysInProcess}d`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 font-mono">
                Belum ada data lamaran untuk ditampilkan pada timeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}