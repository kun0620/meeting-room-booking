import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/features/bookings/services/bookings.service";
import type { Booking } from "@/features/bookings/services/bookings.service";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export function NextBookingsList() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["all-bookings"],
    queryFn: getBookings,
  });

  // Get upcoming bookings, limit to 5
  const upcomingBookings = bookings
    .filter((b: Booking) => b.status !== 'cancelled' && new Date(b.end_time) > new Date())
    .sort((a: Booking, b: Booking) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  const colors = ["bg-primary", "bg-blue-400", "bg-amber-400", "bg-emerald-400", "bg-slate-300"];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">
          Upcoming Meetings
        </h3>
        <button
          onClick={() => navigate('/app/bookings')}
          className="text-xs text-primary font-bold hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col flex-1 divide-y divide-slate-50 min-h-[300px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-slate-300">progress_activity</span>
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <span className="material-symbols-outlined !text-4xl text-slate-100">event_busy</span>
            <p className="text-xs font-bold">No upcoming bookings</p>
          </div>
        ) : (
          upcomingBookings.map((booking: Booking, i: number) => (
            <div
              key={booking.id}
              className="py-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-10 rounded-full ${colors[i % colors.length]}`}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1.5 group-hover:text-primary transition-colors">
                    {booking.title}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {booking.rooms?.name} • <span className="text-slate-400">Host: {booking.profiles?.full_name?.split(' ')[0] || 'Member'}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
                  {format(new Date(booking.start_time), "p")}
                </p>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                  {format(new Date(booking.start_time), "MMM d")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
