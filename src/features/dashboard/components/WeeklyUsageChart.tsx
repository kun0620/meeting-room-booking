import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/features/bookings/services/bookings.service";
import type { Booking } from "@/features/bookings/services/bookings.service";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";

export function WeeklyUsageChart() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["all-bookings"],
    queryFn: getBookings,
  });

  // Calculate stats for the current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const chartData = days.map(day => {
    const dayBookings = bookings.filter(b =>
      b.status !== 'cancelled' &&
      isSameDay(new Date(b.start_time), day)
    );

    // Calculate actual occupancy minutes (assuming 8h workday = 480 mins)
    const workdayMinutes = 8 * 60;
    const occupiedMinutes = dayBookings.reduce((acc, b) => {
      const duration = (new Date(b.end_time).getTime() - new Date(b.start_time).getTime()) / (1000 * 60);
      return acc + duration;
    }, 0);

    const value = Math.min(Math.round((occupiedMinutes / workdayMinutes) * 100), 100);

    return {
      day: format(day, "EEE"),
      dayFull: format(day, "EEEE"),
      value
    };
  });

  const avgOccupancy = Math.round(chartData.reduce((acc, curr) => acc + curr.value, 0) / 7);

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-slate-900">
            Weekly Occupancy
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Real-time usage rates
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-primary">
            {isLoading ? "..." : `${avgOccupancy}%`}
          </p>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-lg mt-1">
            Live from Database
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-4 px-2 mt-4">
        {isLoading ? (
          <div className="flex-1 h-full flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-slate-200">progress_activity</span>
          </div>
        ) : (
          chartData.map((item) => (
            <div
              key={item.dayFull}
              className="flex flex-col items-center flex-1 gap-4 h-full group"
            >
              <div className="w-full bg-slate-50 rounded-2xl h-full flex flex-col justify-end overflow-hidden relative border border-slate-50">
                <div
                  className="w-full bg-primary rounded-t-xl transition-all duration-500 ease-out group-hover:brightness-110"
                  style={{ height: `${item.value}%` }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl -translate-y-4">
                    {item.value}%
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {item.day}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}