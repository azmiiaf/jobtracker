export default function ApplicationCard({ application, onClick }) {
  // Styling status dengan pendekatan monokrom high-contrast
  const statusStyles = {
    Applied: 'bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
    Interview: 'bg-black text-white dark:bg-white dark:text-black border-transparent font-bold',
    Offered: 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-extrabold ring-1 ring-neutral-400',
    Rejected: 'line-through opacity-60 bg-neutral-200 text-neutral-600 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800',
  };

  return (
    <div
      onClick={() => onClick(application.id)}
      className="group relative cursor-pointer p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all duration-150 shadow-sm hover:shadow-md"
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:underline decoration-1 underline-offset-4">
          {application.position}
        </h4>
        <span
          className={`px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border rounded ${
            statusStyles[application.status] || statusStyles.Applied
          }`}
        >
          {application.status}
        </span>
      </div>

      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
        {application.company_name}
      </p>

      <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/60 pt-2.5">
        <span>📍 {application.location || 'Remote'}</span>
        <span>{application.work_type || 'Full Time'}</span>
      </div>
    </div>
  );
}