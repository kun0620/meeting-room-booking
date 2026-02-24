import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between p-4">

      {/* Top Section */}
      <div className="flex flex-col gap-8">

        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary rounded-lg p-2 text-white">
            <span className="material-symbols-outlined text-2xl">
              meeting_room
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-slate-900 text-lg font-bold leading-none">
              Neturai
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Workspace Manager
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 text-sm">

          <SidebarLink to="/" icon="dashboard" label="Dashboard" end />

          <SidebarLink
            to="/calendar"
            icon="calendar_today"
            label="Calendar"
          />

          <SidebarLink
            to="/bookings"
            icon="bookmark"
            label="My Bookings"
            badge={3}
          />

          <SidebarLink
            to="/rooms"
            icon="door_open"
            label="Rooms"
          />

          <SidebarLink
            to="/settings"
            icon="settings"
            label="Settings"
          />

        </nav>

      </div> {/* ✅ ปิด top section ให้ถูก */}

      {/* Bottom Section */}
      <div className="bg-primary/5 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs text-slate-600 text-center">
          Need more features?
        </p>
        <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
          Upgrade Pro
        </button>
      </div>

    </aside>
  );
}

/* ---------- Reusable NavLink ---------- */

type Props = {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
  badge?: number;
};

function SidebarLink({ to, icon, label, end, badge }: Props) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined">{icon}</span>
        <span>{label}</span>
      </div>

      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}