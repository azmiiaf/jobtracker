export default function StatsOverview({ applications = [] }) {
  const total = applications.length;
  const applied = applications.filter((a) => a.status === 'Applied').length;
  const interview = applications.filter((a) => a.status === 'Interview').length;
  const offered = applications.filter((a) => a.status === 'Offered').length;

  const stats = [
    { label: 'TOTAL LAMARAN', value: total, style: 'border-neutral-300 dark:border-neutral-800' },
    { label: 'MENUNGGU (APPLIED)', value: applied, style: 'border-neutral-300 dark:border-neutral-800' },
    { label: 'TAHAP INTERVIEW', value: interview, style: 'border-black dark:border-white font-bold' },
    { label: 'OFFER RECEIVED', value: offered, style: 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-transparent' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${stat.style}`}
        >
          <span className="text-[10px] font-mono tracking-wider opacity-70 uppercase">
            {stat.label}
          </span>
          <span className="text-2xl font-mono font-extrabold mt-1">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}