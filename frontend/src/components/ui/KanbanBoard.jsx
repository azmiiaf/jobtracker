import ApplicationCard from './ApplicationCard';

const COLUMNS = [
  { key: 'Applied', label: 'APPLIED' },
  { key: 'Interview', label: 'INTERVIEW' },
  { key: 'Offered', label: 'OFFERED' },
  { key: 'Rejected', label: 'REJECTED' },
];

export default function KanbanBoard({ applications = [], onSelectApp }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const items = applications.filter((app) => app.status === col.key);

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-xl bg-neutral-100/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 p-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 px-1">
              <span className="font-mono text-xs font-bold tracking-wider text-neutral-700 dark:text-neutral-300">
                {col.label}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {items.length}
              </span>
            </div>

            {/* Application List */}
            <div className="flex-1 space-y-3">
              {items.length > 0 ? (
                items.map((app) => (
                  <ApplicationCard key={app.id} application={app} onClick={onSelectApp} />
                ))
              ) : (
                <div className="h-32 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg flex items-center justify-center text-xs font-mono text-neutral-400 dark:text-neutral-600">
                  KOSONG
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}