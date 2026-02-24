import { useState } from "react";
import type { CalendarBooking } from "../types";
import BookingDetailsPanel from "../components/BookingDetailsPanel";

export default function CalendarPage() {
  const [selected, setSelected] = useState<CalendarBooking | null>(null);

  const hours = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const bookings: CalendarBooking[] = [
    {
        id: "1",
        title: "Design Review",
        room: "Conf Room A",

        // 👇 domain fields (ต้องมี)
        date: "June 20, 2024",
        start: "10:00 AM",
        end: "11:00 AM",
        status: "confirmed",
        participants: [],

        // 👇 calendar layout fields
        dayIndex: 1,
        top: 160,
        height: 80,
    },
    ];

  return (
    <div className="flex h-screen">

  <div className="flex-1 bg-white relative">

    <div className="grid grid-cols-8 min-h-[1000px]">

      {/* Time Column */}
      <div className="flex flex-col text-right pr-4 pt-4 border-r border-slate-100">
        {hours.map((h) => (
          <div key={h} className="h-20 text-xs text-slate-400">
            {h}
          </div>
        ))}
      </div>

      {/* Day Columns */}
      {days.map((day, i) => (
        <div key={day} className="relative border-r border-slate-100">

          <div className="text-center py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="block text-xs font-semibold text-slate-500">
              {day}
            </span>
            <span className="text-lg font-bold">{17 + i}</span>
          </div>

          {bookings
            .filter((b) => b.dayIndex === i)
            .map((b) => (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                style={{ top: b.top, height: b.height }}
                className="absolute left-1 right-1 bg-primary/10 border-l-4 border-primary rounded p-2 cursor-pointer"
              >
                <p className="text-[10px] font-bold text-primary uppercase">
                  {b.room}
                </p>
                <p className="text-xs font-semibold truncate">
                  {b.title}
                </p>
              </div>
            ))}
        </div>
      ))}
    </div>
  </div>

  {selected && (
    <BookingDetailsPanel
      booking={selected}
      onClose={() => setSelected(null)}
    />
  )}

</div>
  );
}