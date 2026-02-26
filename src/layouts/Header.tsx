import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { logout } from "@/features/auth/services/auth.service";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-30">
      <div className="flex items-center gap-4">
        <span className="text-slate-400">/</span>
        <h2 className="text-slate-800 font-semibold">Neturai Workspace</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            className="bg-slate-100 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Search rooms..."
            type="text"
          />
        </div>

        <button className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
          Upgrade
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-white shadow-sm hover:ring-primary/20 transition-all overflow-hidden"
          >
            {user?.email ? (
              <span className="text-xs font-bold text-primary">
                {user.email[0].toUpperCase()}
              </span>
            ) : (
              <span className="material-symbols-outlined text-slate-400">person</span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.email}
                </p>
              </div>

              <Link
                to="/app/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}