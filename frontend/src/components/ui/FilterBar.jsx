export default function FilterBar({ search, setSearch, filterStatus, setFilterStatus, onOpenCreateModal }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-1 items-center gap-2">
        {/* Input Cari */}
        <input
          type="text"
          placeholder="Cari perusahaan / posisi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-1.5 text-xs font-mono bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-neutral-100"
        />

        {/* Dropdown Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs font-mono bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded outline-none text-neutral-900 dark:text-neutral-100 cursor-pointer"
        >
          <option value="ALL">SEMUA STATUS</option>
          <option value="Applied">APPLIED</option>
          <option value="Interview">INTERVIEW</option>
          <option value="Offered">OFFERED</option>
          <option value="Rejected">REJECTED</option>
        </select>
      </div>

      {/* Tombol Tambah Lamaran */}
      <button
        onClick={onOpenCreateModal}
        className="px-4 py-2 text-xs font-mono font-bold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-white transition flex items-center justify-center gap-1"
      >
        <span>+</span> TAMBAH LAMARAN
      </button>
    </div>
  );
}