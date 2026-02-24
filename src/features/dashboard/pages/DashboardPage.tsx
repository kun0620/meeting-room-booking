import { WeeklyUsageChart } from "../components/WeeklyUsageChart";
import { NextBookingsList } from "../components/NextBookingsList";

export function DashboardPage() {
  return (
    <div>

      {/* Welcome */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Good morning, Gun!
          </h1>
          <p className="text-slate-500 mt-1">
            Here is what's happening today in your office.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Book a Room</span>
        </button>
      </div>

      {/* Stats + Chart + List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

        <div className="lg:col-span-3">
          <WeeklyUsageChart />
        </div>

        <div className="lg:col-span-2">
          <NextBookingsList />
        </div>

      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <QuickCard icon="map" label="Floor Map" />
        <QuickCard icon="group" label="Teams" />
        <QuickCard icon="inventory_2" label="Resources" />
        <QuickCard icon="support_agent" label="IT Support" />

      </div>

    </div>
  );
}

/* ---------- Quick Card Component ---------- */

type QuickCardProps = {
  icon: string;
  label: string;
};

function QuickCard({ icon, label }: QuickCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:border-primary/40 cursor-pointer transition-colors group">

      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary">
        <span className="material-symbols-outlined">
          {icon}
        </span>
      </div>

      <span className="text-sm font-bold text-slate-900">
        {label}
      </span>

    </div>
  );
}