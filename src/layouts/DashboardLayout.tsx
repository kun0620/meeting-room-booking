import { Outlet, Link } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background-light">

      <aside className="w-64 bg-white border-r border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-6">
          Neturai
        </h2>

        <nav className="space-y-3 text-sm">
          <Link to="/" className="block hover:text-primary">
            Dashboard
          </Link>

          <Link to="/rooms" className="block hover:text-primary">
            Rooms
          </Link>

          <Link to="/bookings" className="block hover:text-primary">
            My Bookings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}