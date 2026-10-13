export default function PageSkeleton({ label = "Memuat halaman..." }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="min-h-screen bg-neutral-50 text-neutral-900 font-mono select-none"
    >
      {/* Header / Navbar Skeleton */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-5 w-28 bg-neutral-200 rounded animate-pulse" />
            <div className="hidden h-5 w-px bg-neutral-200 sm:block" />
            <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-neutral-100 rounded animate-pulse" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-[1600px] mx-auto p-6 pt-24 space-y-6">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse" />
            <div className="h-3.5 w-64 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>

        {/* 5 Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="bg-[#0d0d0d] border border-neutral-800 p-4 rounded-xl shadow-lg"
            >
              <div className="h-3 w-20 bg-neutral-800 rounded animate-pulse mb-3" />
              <div className="h-7 w-12 bg-neutral-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Big Block Skeleton */}
        <div className="bg-[#0d0d0d] border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-4">
          <div className="h-8 w-full bg-neutral-900 rounded animate-pulse" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-10 w-full bg-neutral-900/60 rounded border border-neutral-800/40 animate-pulse"
              />
            ))}
          </div>
        </div>

        <span className="sr-only">{label}</span>
      </main>
    </div>
  );
}
