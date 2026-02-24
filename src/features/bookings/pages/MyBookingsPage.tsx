import { useState } from "react";

type Booking = {
  id: string;
  room: string;
  title: string;
  date: string;
  time: string;
  status: "confirmed" | "upcoming";
};

export default function MyBookingsPage() {
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      room: "Conference Room A",
      title: "Quarterly Sprint Planning",
      date: "Oct 24, 2023",
      time: "10:00 AM - 11:30 AM",
      status: "confirmed",
    },
    {
      id: "2",
      room: "Meeting Room 2",
      title: "Design System Review",
      date: "Oct 25, 2023",
      time: "02:00 PM - 03:00 PM",
      status: "upcoming",
    },
  ]);

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            My Bookings
          </h2>
          <p className="text-slate-500 mt-1">
            Manage and track your upcoming room reservations.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none w-64 transition-all"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            Filter
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Room
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Time
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          meeting_room
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {b.room}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.date}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.time}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">
                          close
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to{" "}
            <span className="font-medium text-slate-900">2</span> of{" "}
            <span className="font-medium text-slate-900">12</span> results
          </p>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed">
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-sm font-bold">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function StatusBadge({ status }: { status: "confirmed" | "upcoming" }) {
    if (status === "confirmed") {
        return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            Confirmed
        </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
        Upcoming
        </span>
    );
    }
}