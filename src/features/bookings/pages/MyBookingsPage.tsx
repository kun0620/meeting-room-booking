import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMyBookings, cancelBooking } from "../services/bookings.service";
import type { Booking } from "../services/bookings.service";

export default function MyBookingsPage() {
  const queryClient = useQueryClient();

  // ─── Data Fetching ────────────────────────────────────────────────
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  // ─── Mutations ────────────────────────────────────────────────────
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black">My Bookings</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage your upcoming and past meeting room reservations.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <span className="material-symbols-outlined !text-4xl">event_busy</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
              You haven't made any room reservations yet. Head over to the Rooms page to start.
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancel(booking.id)}
              isCancelling={cancelMutation.isPending && cancelMutation.variables === booking.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
  isCancelling
}: {
  booking: Booking;
  onCancel: () => void;
  isCancelling?: boolean;
}) {
  const isCancelled = booking.status === "cancelled";

  return (
    <div className={`bg-white border rounded-2xl p-6 transition-all hover:border-primary/20 ${isCancelled ? 'opacity-60' : 'hover:shadow-lg hover:shadow-primary/5'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined">meeting_room</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{booking.title}</h3>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">location_on</span>
                {booking.rooms?.name || "Unknown Room"}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {format(new Date(booking.start_time), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">schedule</span>
                {format(new Date(booking.start_time), "HH:mm")} - {format(new Date(booking.end_time), "HH:mm")}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${isCancelled
                ? "bg-slate-100 text-slate-500"
                : booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
              {booking.status}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
              Booking Ref: {booking.id.slice(0, 8)}
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={isCancelled || isCancelling}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${isCancelled
                ? "bg-slate-50 text-slate-300 pointer-events-none"
                : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
              }`}
            title="Cancel booking"
          >
            {isCancelling ? (
              <span className="material-symbols-outlined animate-spin !text-xl">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined !text-xl">close</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}