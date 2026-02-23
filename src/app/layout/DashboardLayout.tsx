import { Outlet, Link } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-6 space-y-4">
        <h1 className="text-xl font-bold">Meeting Room</h1>

        <nav className="space-y-2">
          <Link to="/" className="block hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/my-bookings" className="block hover:text-blue-600">
            My Bookings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}