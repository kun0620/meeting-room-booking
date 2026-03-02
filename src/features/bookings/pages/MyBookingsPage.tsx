import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMyBookings, cancelBooking, updateBooking } from "../services/bookings.service";
import { getRooms } from "@/features/rooms/services/rooms.service";
import { CreateBookingModal } from "@/components/ui/modal/CreateBookingModal";
import { ConfirmModal } from "@/components/ui/modal/ConfirmModal";
import type { BookingFormData } from "@/components/ui/modal/CreateBookingModal";
import type { Booking } from "../services/bookings.service";

export default function MyBookingsPage() {
  const queryClient = useQueryClient();
  // ─── State ───────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // ─── Data Fetching ────────────────────────────────────────────────
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  // ─── Mutations ────────────────────────────────────────────────────
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setCancellingBookingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: BookingFormData }) =>
      updateBooking(id, {
        title: data.title,
        room_id: data.roomId,
        description: data.description,
        start_time: `${data.date}T${data.startTime}:00`,
        end_time: `${data.date}T${data.endTime}:00`,
        participant_ids: data.participants.map(p => p.id)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setEditingBooking(null);
    },
  });

  const handleCancelClick = (id: string) => {
    setCancellingBookingId(id);
  };

  const confirmCancel = () => {
    if (cancellingBookingId) {
      cancelMutation.mutate(cancellingBookingId);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const handleEditSubmit = (formData: BookingFormData) => {
    if (editingBooking) {
      updateMutation.mutate({ id: editingBooking.id, data: formData });
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.rooms?.name.toLowerCase().includes(search.toLowerCase());

      const now = new Date();
      const isUpcoming = new Date(b.start_time) > now && b.status !== 'cancelled';
      const isCancelled = b.status === "cancelled";

      if (statusFilter === "upcoming") return matchesSearch && isUpcoming;
      if (statusFilter === "cancelled") return matchesSearch && isCancelled;
      return matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl"> progress_activity </span>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading your records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">

      {/* Header & Search Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Manage and track your upcoming room reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-sm font-medium"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Title</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300 text-3xl">event_busy</span>
                      </div>
                      <p className="text-slate-400 text-sm font-bold">No reservations found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <BookingTableRow
                    key={booking.id}
                    booking={booking}
                    onCancel={() => handleCancelClick(booking.id)}
                    onEdit={() => handleEdit(booking)}
                    isCancelling={cancelMutation.isPending && cancelMutation.variables === booking.id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-6 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="text-slate-900">{filteredBookings.length}</span> results
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-9 px-4 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-slate-600 transition-all disabled:opacity-30"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`size-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'border border-slate-200 text-slate-500 hover:bg-white'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-9 px-4 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white hover:text-primary transition-all disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-slate-400 text-xs font-medium gap-4 pb-10">
        <p>© 2023 RoomSync Platform. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Help Center</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </footer>

      {/* Edit Booking Modal */}
      <CreateBookingModal
        open={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onSubmit={handleEditSubmit}
        rooms={rooms}
        initialData={editingBooking ? {
          title: editingBooking.title,
          roomId: editingBooking.room_id,
          date: format(new Date(editingBooking.start_time), "yyyy-MM-dd"),
          startTime: format(new Date(editingBooking.start_time), "HH:mm"),
          endTime: format(new Date(editingBooking.end_time), "HH:mm"),
          description: editingBooking.description || "",
          participants: editingBooking.booking_participants?.map(p => ({
            id: p.user_id,
            name: p.profiles.full_name,
            avatar: p.profiles.avatar_url
          })) || []
        } : undefined}
      />

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        open={!!cancellingBookingId}
        title="Cancel Booking"
        description="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmText="Yes, Cancel"
        loading={cancelMutation.isPending}
        onConfirm={confirmCancel}
        onClose={() => setCancellingBookingId(null)}
      />

    </div>
  );
}

function BookingTableRow({
  booking,
  onCancel,
  onEdit,
  isCancelling
}: {
  booking: Booking,
  onCancel: () => void,
  onEdit: () => void,
  isCancelling: boolean
}) {
  const isCancelled = booking.status === "cancelled";
  const start = new Date(booking.start_time);
  const end = new Date(booking.end_time);

  // Status Badge Logic
  let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
  let statusText = "Confirmed";

  if (isCancelled) {
    statusColor = "bg-slate-100 text-slate-500 border-slate-200";
    statusText = "Cancelled";
  } else if (start > new Date()) {
    statusColor = "bg-blue-100 text-blue-700 border-blue-200";
    statusText = "Upcoming";
  }

  // Diversify Room Icons
  const roomName = booking.rooms?.name || "";
  let roomIcon = "meeting_room";
  let roomBg = "bg-primary/10 text-primary";

  if (roomName.toLowerCase().includes("meeting")) {
    roomIcon = "groups";
    roomBg = "bg-blue-100 text-blue-600";
  } else if (roomName.toLowerCase().includes("executive") || roomName.toLowerCase().includes("suite")) {
    roomIcon = "workspace_premium";
    roomBg = "bg-purple-100 text-purple-600 text-purple-600";
  }

  return (
    <tr className={`group transition-colors hover:bg-slate-50/50 ${isCancelled ? 'opacity-50' : ''}`}>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className={`size-10 rounded-xl ${roomBg} flex items-center justify-center`}>
            <span className="material-symbols-outlined !text-xl">{roomIcon}</span>
          </div>
          <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
            {booking.rooms?.name || "Unknown Room"}
          </span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-600 leading-tight mb-0.5">{booking.title}</span>
          {booking.description && (
            <span className="text-[11px] text-slate-400 font-medium line-clamp-1 truncate max-w-[200px]">
              {booking.description}
            </span>
          )}
        </div>
      </td>
      <td className="px-8 py-6">
        <span className="text-sm text-slate-600 font-medium">
          {format(start, "MMM d, yyyy")}
        </span>
      </td>
      <td className="px-8 py-6">
        <span className="text-sm text-slate-600 font-medium uppercase tracking-tighter">
          {format(start, "hh:mm a")} - {format(end, "hh:mm a")}
        </span>
      </td>
      <td className="px-8 py-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColor}`}>
          {statusText}
        </span>
      </td>
      <td className="px-8 py-6 text-right pr-12">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Edit"
          >
            <span className="material-symbols-outlined !text-lg">edit</span>
          </button>
          <button
            onClick={onCancel}
            disabled={isCancelled || isCancelling}
            className={`p-1.5 transition-all ${isCancelled ? 'hidden' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg'}`}
            title="Cancel"
          >
            {isCancelling ? (
              <span className="material-symbols-outlined !text-lg animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined !text-lg">close</span>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}