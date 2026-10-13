import { logout, getCurrentUser } from "../../services/authService";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  // Menampilkan nama/email dari sesi user
  const userName = user?.name || user?.email || user?.username || "Online";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white px-6 py-4 text-xs shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-6">
          <NavLink
            to="/"
            className="shrink-0 text-sm font-bold font-mono tracking-widest text-neutral-900"
          >
            JOBTRACKER
          </NavLink>
          <div className="hidden h-5 w-px bg-neutral-200 sm:block" />
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-neutral-500">USER:</span>
            <strong className="truncate font-bold text-neutral-900">
              {userName}
            </strong>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="shrink-0 border border-red-600 bg-white px-4 py-2 font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
}
