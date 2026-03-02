import { useState, useMemo } from "react";
import { startOfWeek, addWeeks, subWeeks, format, eachDayOfInterval, getDay, addDays, differenceInMinutes, isSameDay, startOfDay } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, createBooking } from "@/features/bookings/services/bookings.service";
import { getRooms } from "@/features/rooms/services/rooms.service";
import { CreateBookingModal } from "@/components/ui/modal/CreateBookingModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { BookingFormData } from "@/components/ui/modal/CreateBookingModal";
import type { Booking } from "@/features/bookings/services/bookings.service";
import type { CalendarBooking } from "../types";
import BookingDetailsPanel from "../components/BookingDetailsPanel";

const COLUMN_HEIGHT = 80; // Height per hour in pixels
const START_HOUR = 8;     // Calendar starts at 8 AM

export default function CalendarPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<CalendarBooking | null>(null);
  const [bookingSlot, setBookingSlot] = useState<{ date: Date, hour: number } | null>(null);
  const [roomFilter, setRoomFilter] = useState<string>("all");

  // ─── Week Navigation ──────────────────────────────────────────────
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const nextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const prevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const goToToday = () => setCurrentDate(new Date());

  // ─── Data Fetching ────────────────────────────────────────────────
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["all-bookings"],
    queryFn: getBookings,
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  // ─── Mutations ────────────────────────────────────────────────────
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      setBookingSlot(null);
      alert("Booking confirmed successfully!");
    },
    onError: (error: any) => {
      alert(`Booking failed: ${error.message || "Conflict detected"}`);
    }
  });

  const handleBookingSubmit = (data: BookingFormData) => {
    if (!user) return;

    createBookingMutation.mutate({
      room_id: data.roomId,
      user_id: user.id,
      title: data.title,
      description: data.description,
      start_time: `${data.date}T${data.startTime}:00`,
      end_time: `${data.date}T${data.endTime}:00`,
    });
  };

  // ─── Layout Logic ─────────────────────────────────────────────────
  const calendarBookings = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);

        // Calculate vertical position
        const startMinutesOffset = differenceInMinutes(start, startOfDay(start)) - (START_HOUR * 60);
        const top = (startMinutesOffset / 60) * COLUMN_HEIGHT + 80; // +80 for header offset

        // Calculate height
        const duration = differenceInMinutes(end, start);
        const height = (duration / 60) * COLUMN_HEIGHT;

        // Calculate day index (0 = Sun, 1 = Mon ... 6 = Sat)
        let dayIdx = getDay(start) - 1;
        if (dayIdx < 0) dayIdx = 6;

        return {
          ...b,
          room: b.rooms?.name || 'Unknown Room',
          date: format(start, "MMMM d, yyyy"),
          start: format(start, "p"),
          end: format(end, "p"),
          amenities: b.rooms?.amenities || [],
          participants: b.booking_participants?.map(p => ({
            id: p.user_id,
            name: p.profiles?.full_name || 'Unknown',
            avatar: p.profiles?.avatar_url,
            role: 'Member'
          })) || [],
          dayIndex: dayIdx,
          top,
          height
        } as CalendarBooking;
      })
      .filter(b => {
        const bDate = new Date(b.start_time);
        // Filter correctly based on the visible week range
        const startOfVisibleWeek = startOfDay(weekStart);
        const endOfVisibleWeek = addDays(startOfVisibleWeek, 7);
        const matchesDate = bDate >= startOfVisibleWeek && bDate < endOfVisibleWeek;
        const matchesRoom = roomFilter === "all" || b.room_id === roomFilter;
        return matchesDate && matchesRoom;
      });
  }, [bookings, weekStart]);

  const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col">

      {/* Calendar Header / Navigation */}
      <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Calendar</span>
              <span className="text-[10px] text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(weekStart, "yyyy")}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {format(weekStart, "MMMM")}
            </h2>
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <NavButton onClick={prevWeek} icon="chevron_left" />
            <div className="h-4 w-[1px] bg-slate-200 mx-1 self-center" />
            <button
              onClick={goToToday}
              className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors"
            >
              Today
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1 self-center" />
            <NavButton onClick={nextWeek} icon="chevron_right" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="material-symbols-outlined text-slate-400 !text-lg">filter_list</span>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-2"
            >
              <option value="all">All Rooms</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="h-8 w-[1px] bg-slate-100 mx-2" />

          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Live View
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="flex relative min-h-[1000px] bg-white">
          <div className="grid grid-cols-8 w-full">

            {/* Time Column */}
            <div className="flex flex-col text-right pr-4 pt-[80px] border-r border-slate-100 bg-white sticky left-0 z-10">
              {hours.map((h) => (
                <div key={h} className="h-20 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {h}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((day, i) => (
              <div key={day.toString()} className="relative border-r border-slate-50 last:border-r-0 group">

                {/* Day Header */}
                <div className={`text-center py-5 border-b border-slate-100 sticky top-0 bg-white z-10 ${isSameDay(day, new Date()) ? 'bg-primary/[0.02]' : ''}`}>
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {format(day, "EEE")}
                  </span>
                  <span className={`inline-flex size-8 items-center justify-center rounded-full text-lg font-black ${isSameDay(day, new Date())
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-slate-900'
                    }`}>
                    {format(day, "d")}
                  </span>
                </div>

                {/* Grid Click Overlays */}
                <div className="absolute inset-0 pt-[80px]">
                  {hours.map((_, hIdx) => (
                    <div
                      key={hIdx}
                      onClick={() => setBookingSlot({ date: day, hour: START_HOUR + hIdx })}
                      className="h-20 border-b border-slate-50/50 hover:bg-primary/[0.03] transition-colors cursor-crosshair group/grid"
                    >
                      <div className="size-full flex items-center justify-center opacity-0 group-hover/grid:opacity-100 transition-opacity">
                        <div className="bg-primary text-white size-8 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover/grid:scale-100 transition-transform">
                          <span className="material-symbols-outlined text-lg">add</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bookings */}
                {calendarBookings
                  .filter((b) => b.dayIndex === i)
                  .map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelected(b)}
                      style={{ top: b.top, height: b.height }}
                      className="absolute left-1 right-1 bg-white border border-primary/20 border-l-4 border-l-primary rounded-xl p-2.5 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all z-20 group/item overflow-hidden"
                    >
                      <div className="flex flex-col h-full">
                        <p className="text-[9px] font-black text-primary uppercase tracking-tighter truncate opacity-80">
                          {b.room}
                        </p>
                        <p className="text-[11px] font-bold text-slate-900 leading-tight mt-0.5 group-hover/item:text-primary transition-colors line-clamp-2">
                          {b.title}
                        </p>
                        <div className="mt-auto pt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined !text-[10px] text-slate-400">schedule</span>
                          <p className="text-[9px] font-bold text-slate-400 truncate uppercase">
                            {b.start.replace(':00', '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <BookingDetailsPanel
          booking={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Quick Booking Modal from Grid */}
      <CreateBookingModal
        open={!!bookingSlot}
        onClose={() => setBookingSlot(null)}
        onSubmit={handleBookingSubmit}
        rooms={rooms.filter(r => r.is_active)}
        initialData={bookingSlot ? {
          title: "",
          roomId: rooms.find(r => r.is_active)?.id || "",
          date: format(bookingSlot.date, "yyyy-MM-dd"),
          startTime: `${bookingSlot.hour.toString().padStart(2, '0')}:00`,
          endTime: `${(bookingSlot.hour + 1).toString().padStart(2, '0')}:00`,
          description: "",
          participants: []
        } : undefined}
      />
    </div>
  );
}

function NavButton({ onClick, icon }: { onClick: () => void; icon: string }) {
  return (
    <button
      onClick={onClick}
      className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
    </button>
  );
}