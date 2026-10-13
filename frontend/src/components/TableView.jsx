export default function TableView({ applications = [], onSelectApp }) {
  const statusStyles = {
    Applied: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700',
    Interview: 'bg-black text-white dark:bg-white dark:text-black font-bold',
    Offered: 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-extrabold',
    Rejected: 'line-through opacity-60 bg-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400',
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/60 text-neutral-500 uppercase tracking-wider">
            <th className="py-3 px-4">Perusahaan</th>
            <th className="py-3 px-4">Posisi</th>
            <th className="py-3 px-4">Lokasi</th>
            <th className="py-3 px-4">Tipe</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                  {app.company_name}
                </td>
                <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                  {app.position}
                </td>
                <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                  {app.location || '-'}
                </td>
                <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                  {app.work_type || 'Full Time'}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-block px-2 py-0.5 font-mono border rounded uppercase text-[10px] ${statusStyles[app.status] || statusStyles.Applied}`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="text-[11px] underline font-bold hover:opacity-75">
                    Detail ↗
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-12 text-center text-neutral-400 font-mono">
                TIDAK ADA DATA LAMARAN
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}