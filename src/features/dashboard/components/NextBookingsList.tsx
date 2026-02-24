type Booking = {
  id: string;
  title: string;
  room: string;
  host: string;
  time: string;
  color: string;
};

const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Project Sync",
    room: "Boardroom A",
    host: "Gun",
    time: "10:00 AM",
    color: "bg-primary",
  },
  {
    id: "2",
    title: "Client Presentation",
    room: "Sky Lounge",
    host: "Sarah K.",
    time: "11:30 AM",
    color: "bg-blue-400",
  },
  {
    id: "3",
    title: "Design Review",
    room: "Focus Hub 2",
    host: "David R.",
    time: "01:00 PM",
    color: "bg-amber-400",
  },
  {
    id: "4",
    title: "HR Monthly Review",
    room: "Quiet Zone",
    host: "Emily W.",
    time: "02:30 PM",
    color: "bg-emerald-400",
  },
  {
    id: "5",
    title: "Daily Standup",
    room: "Boardroom B",
    host: "Gun",
    time: "04:00 PM",
    color: "bg-slate-300",
  },
];

export function NextBookingsList() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">
          Next 5 Bookings
        </h3>
        <button className="text-xs text-primary font-bold hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col flex-1 divide-y divide-slate-100">

        {mockBookings.map((booking) => (
          <div
            key={booking.id}
            className="py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-10 rounded-full ${booking.color}`}
              />
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                  {booking.title}
                </p>
                <p className="text-xs text-slate-500">
                  {booking.room} • Host: {booking.host}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">
              {booking.time}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}