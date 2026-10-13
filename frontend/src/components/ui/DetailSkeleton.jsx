export default function DetailSkeleton({ page = false }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat detail lamaran pekerjaan..."
      className="space-y-6 select-none font-mono"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Memuat Detail Lamaran...
        </span>
        <span className="text-[11px] text-neutral-400 animate-pulse">
          Mengambil data terbaru
        </span>
      </div>

      <div
        className={
          page
            ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]"
            : "space-y-6"
        }
      >
        {/* Left Column Skeleton */}
        <div className="space-y-6">
          {/* Main Info Box */}
          <div className="border border-neutral-200 bg-white p-5 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
              <div className="space-y-2">
                <div className="h-6 w-52 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-neutral-100 rounded-full animate-pulse self-start sm:self-auto" />
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {[
                "LOKASI",
                "TIPE KERJA",
                "SUMBER / PLATFORM",
                "TANGGAL MELAMAR",
              ].map((label, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 w-28 bg-neutral-200 rounded animate-pulse" />
            <div className="h-9 w-24 bg-neutral-100 rounded animate-pulse" />
          </div>

          {/* Status Update Form Skeleton */}
          <div className="border border-neutral-200 bg-neutral-50 p-4 space-y-3">
            <div className="h-3.5 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="h-8 bg-neutral-200 rounded animate-pulse" />
              <div className="h-8 bg-neutral-200 rounded animate-pulse" />
              <div className="h-8 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-44 bg-neutral-300 rounded animate-pulse" />
          </div>
        </div>

        {/* Right Column Skeleton (Riwayat Status) */}
        <div className="border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-10 bg-neutral-100 rounded animate-pulse" />
          </div>

          {/* Timeline steps */}
          <div className="space-y-4 pt-1">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-3 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  {step !== 3 && <div className="w-0.5 h-12 bg-neutral-200 my-1" />}
                </div>
                <div className="space-y-2 flex-1 pb-2">
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                  <div className="h-3 w-36 bg-neutral-100 rounded" />
                  <div className="h-3 w-4/5 bg-neutral-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
