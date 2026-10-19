export function StatsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat statistik ringkasan"
      className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs"
    >
      {[
        "TOTAL TUGAS",
        "IN PROGRESS",
        "INTERVIEW",
        "OFFER",
        "DITOLAK",
      ].map((label, index) => (
        <div
          key={index}
          className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg text-center"
        >
          <p className="text-neutral-500 uppercase font-bold text-[10px] tracking-wider mb-2">
            {label}
          </p>
          <div className="h-7 w-12 mx-auto bg-neutral-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat tabel data lamaran"
      className="bg-[#0d0d0d] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col"
    >
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 shrink-0">
        <span className="font-bold tracking-wider uppercase text-[11px] text-neutral-300">
          Memuat Daftar Lamaran...
        </span>
        <span className="text-[10px] text-neutral-500 animate-pulse">Sinkronisasi data</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table className="w-full text-left border-collapse text-xs min-w-[720px]">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-500 uppercase font-bold text-[10px] tracking-wider">
              <th className="py-3 px-4">Perusahaan / Tugas</th>
              <th className="py-3 px-4">Posisi</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4">Work Type</th>
              <th className="py-3 px-4">Tanggal Apply</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-3.5 px-4">
                  <div className="h-4 w-28 bg-neutral-800 rounded mb-1" />
                  <div className="h-2.5 w-16 bg-neutral-900 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-3.5 w-32 bg-neutral-800/80 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-3 w-20 bg-neutral-800/70 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-3 w-16 bg-neutral-800/70 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-3 w-20 bg-neutral-800/70 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-5 w-20 bg-neutral-800 rounded-full" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="h-5 w-12 bg-neutral-800 rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  const columns = ["Applied", "Interview", "Offer", "Rejected"];
  return (
    <div
      role="status"
      aria-label="Memuat papan kanban lamaran"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
    >
      {columns.map((col) => (
        <div
          key={col}
          className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-4 flex flex-col min-h-[420px]"
        >
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-neutral-800">
            <h3 className="font-bold text-xs tracking-wider text-neutral-300 uppercase">
              {col}
            </h3>
            <div className="h-4 w-6 bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="space-y-3 flex-1">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="bg-neutral-950 border border-neutral-800/90 p-3.5 rounded-lg space-y-3 animate-pulse"
              >
                <div className="space-y-1.5">
                  <div className="h-3.5 w-3/4 bg-neutral-800 rounded" />
                  <div className="h-3 w-1/2 bg-neutral-900 rounded" />
                </div>
                <div className="pt-2 border-t border-neutral-900 flex justify-between items-center">
                  <div className="h-4 w-16 bg-neutral-800 rounded" />
                  <div className="h-4 w-10 bg-neutral-900 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GanttSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat timeline proyek lamaran"
      className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse mb-1.5" />
          <div className="h-3 w-56 bg-neutral-900 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
      <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
        <div className="min-w-[900px] p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 animate-pulse py-1 border-b border-neutral-900/80 last:border-0"
            >
              <div className="w-48 h-4 bg-neutral-800 rounded shrink-0" />
              <div
                className="h-7 bg-neutral-850 bg-neutral-800/70 border border-neutral-700/50 rounded-lg flex-1"
                style={{ maxWidth: `${40 + row * 10}%`, marginLeft: `${(row % 3) * 12}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
