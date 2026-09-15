import { useMemo } from 'react';

export default function ApplicationBoard({ applications = [], onSelectApplication }) {
  const columns = ['Applied', 'Interview', 'Offer', 'Rejected'];

  // Menghitung jumlah hari sejak tanggal melamar
  const getDaysAgo = (dateString) => {
    if (!dateString) return 0;
    const diffTime = Math.abs(new Date() - new Date(dateString));
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Mengelompokkan lamaran ke kolom masing-masing
  const groupedApplications = useMemo(() => {
    const acc = { Applied: [], Interview: [], Offer: [], Rejected: [] };
    applications.forEach((app) => {
      const statusKey = Object.keys(acc).find(
        (k) => k.toLowerCase() === app.status?.toLowerCase()
      ) || 'Applied';
      acc[statusKey].push(app);
    });
    return acc;
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            Pipeline & Bottleneck Board
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pantau pergerakan lamaran. Kartu dengan tanda peringatan menunjukkan potensi penumpukan/bottleneck process.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = groupedApplications[col] || [];
          return (
            <div
              key={col}
              className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-4 flex flex-col min-h-[500px]"
            >
              {/* Header Kolom */}
              <div className="flex justify-between items-center pb-3 border-b border-neutral-300 dark:border-neutral-800 mb-4">
                <span className="font-extrabold text-xs uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                  {col}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 rounded">
                  {items.length}
                </span>
              </div>

              {/* List Kartu */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {items.length > 0 ? (
                  items.map((app) => {
                    const days = getDaysAgo(app.applied_date);
                    const isBottleneck = (col === 'Applied' || col === 'Interview') && days > 14;

                    return (
                      <div
                        key={app.id}
                        onClick={() => onSelectApplication(app.id)}
                        className={`p-4 bg-white dark:bg-black border transition cursor-pointer hover:border-black dark:hover:border-white ${
                          isBottleneck
                            ? 'border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-900 dark:ring-neutral-100'
                            : 'border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                            {app.company_name}
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                          {app.position}
                        </p>

                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-neutral-400">{days} hari lalu</span>
                          {isBottleneck && (
                            <span className="px-1.5 py-0.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-bold uppercase tracking-wider">
                              ⚠️ Bottleneck ({days}d)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-400 font-mono">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}