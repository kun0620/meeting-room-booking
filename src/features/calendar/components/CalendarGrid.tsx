import { useState } from "react";
import type { CalendarBooking } from "../types";
import BookingDetailsPanel from "../components/BookingDetailsPanel";

export default function CalendarPage() {
  const [selected, setSelected] = useState<CalendarBooking | null>(null);

  const bookings: CalendarBooking[] = [
    {
        id: "1",
        title: "Design Review",
        room: "Conf Room A",
        date: "June 20, 2024",
        start: "10:00 AM",
        end: "11:00 AM",
        status: "confirmed",
        participants: [],
        dayIndex: 1,
        top: 160,
        height: 80,
    },
    ];

  return (
    <div className="flex h-[calc(100vh-80px)]">

      {/* Calendar area */}
      <div className="flex-1 bg-white relative">
        {/* example block */}
        <div
          onClick={() => setSelected(bookings[0])}
          className="absolute top-[160px] left-[200px] w-40 h-20 bg-primary/10 border-l-4 border-primary cursor-pointer"
        />
      </div>

      {/* Details Panel */}
      {selected && (
        <BookingDetailsPanel
          booking={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}