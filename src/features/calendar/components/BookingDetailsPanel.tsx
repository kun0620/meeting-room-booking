import type { CalendarBooking } from "../types";

type Props = {
  booking: CalendarBooking;
  onClose: () => void;
};

export default function BookingDetailsPanel({
  booking,
  onClose,
}: Props) {
  // Use real participants from booking
  const participants = booking.participants || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[100] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 w-[400px] h-screen border-l border-slate-200 bg-white flex flex-col shrink-0 shadow-2xl z-[101] animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-lg">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-slate-500">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Status */}
          <StatusBadge status={booking.status} />

          {/* Title */}
          <h3 className="text-2xl font-bold leading-tight">
            {booking.title}
          </h3>

          {/* Description */}
          {booking.description && (
            <p className="text-sm text-slate-500 leading-relaxed italic">
              "{booking.description}"
            </p>
          )}

          {/* Info */}
          <div className="space-y-3 text-sm text-slate-600">
            <InfoRow icon="event" text={booking.date} />
            <InfoRow
              icon="schedule"
              text={`${booking.start} – ${booking.end}`}
            />
            <InfoRow
              icon="location_on"
              text={booking.room}
              highlight
            />
          </div>

          {/* Participants */}
          <ParticipantsSection participants={participants} />

          {/* Amenities */}
          <AmenitiesSection amenities={booking.amenities || []} />

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 space-y-3">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
            Edit Booking
          </button>

          <button className="w-full bg-white border border-slate-200 text-red-500 py-3 rounded-lg font-bold text-sm hover:bg-red-50 transition-all">
            Cancel Meeting
          </button>
        </div>
      </aside>
    </>
  );

  function StatusBadge({ status }: { status: string }) {
    const isConfirmed = status === "confirmed";
    const isCancelled = status === "cancelled";

    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${isConfirmed
          ? "bg-emerald-100 text-emerald-700"
          : isCancelled
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
          }`}
      >
        <span className="size-1.5 rounded-full bg-current"></span>
        {status}
      </div>
    );
  }

  function InfoRow({
    icon,
    text,
    highlight,
  }: {
    icon: string;
    text: string;
    highlight?: boolean;
  }) {
    return (
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-slate-400">
          {icon}
        </span>
        <span
          className={`${highlight ? "font-semibold text-primary" : ""
            }`}
        >
          {text}
        </span>
      </div>
    );
  }

  function ParticipantsSection({
    participants,
  }: {
    participants: { id: string; name: string; role: string }[];
  }) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-sm">
            Participants ({participants.length})
          </h4>
          <button className="text-primary text-sm font-semibold">
            Invite
          </button>
        </div>

        <div className="space-y-3">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-amber-300 flex items-center justify-center text-xs font-bold text-white">
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {p.name}
                </span>
                <span className="text-xs text-slate-500">
                  {p.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AmenitiesSection({ amenities }: { amenities: string[] }) {
    const displayAmenities = amenities.length > 0
      ? amenities.map(a => ({ icon: 'check_circle', label: a }))
      : [
        { icon: "tv", label: '85" 4K Display' },
        { icon: "videocam", label: "Poly Studio X50" },
        { icon: "draw", label: "Digital Whiteboard" },
        { icon: "coffee", label: "Refreshments" },
      ];

    return (
      <div className="space-y-4">
        <h4 className="font-bold text-sm">Room Amenities</h4>

        <div className="grid grid-cols-2 gap-2">
          {displayAmenities.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-100"
            >
              <span className="material-symbols-outlined text-slate-500 text-base">
                {a.icon}
              </span>
              <span className="text-xs font-medium truncate">
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}