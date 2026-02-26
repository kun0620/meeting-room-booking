import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "@/components/ui/modal/ConfirmModal";
import { AddRoomModal } from "@/components/ui/modal/AddRoomModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getRooms, createRoom, updateRoom } from "../services/rooms.service";
import { createBooking } from "@/features/bookings/services/bookings.service";
import type { Room } from "../services/rooms.service";

export default function RoomsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  // ─── Data Fetching ────────────────────────────────────────────────
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  // ─── Mutations ────────────────────────────────────────────────────
  const addRoomMutation = useMutation({
    mutationFn: (newRoom: Omit<Room, "id" | "created_at">) => createRoom(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setOpenAddModal(false);
    },
  });

  const toggleRoomMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateRoom(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setOpenConfirm(false);
      setSelectedRoom(null);
      alert("Booking confirmed successfully!");
    },
    onError: (error: any) => {
      alert(`Booking failed: ${error.message || "Conflict detected"}`);
    }
  });

  // ─── Handlers ─────────────────────────────────────────────────────
  const toggleRoom = (id: string, currentActive: boolean) => {
    toggleRoomMutation.mutate({ id, is_active: !currentActive });
  };

  const handleBook = (room: Room) => {
    setSelectedRoom(room);
    setOpenConfirm(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom || !user) return;

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    createBookingMutation.mutate({
      room_id: selectedRoom.id,
      user_id: user.id,
      title: `Meeting @ ${selectedRoom.name}`,
      start_time: now.toISOString(),
      end_time: oneHourLater.toISOString(),
    });
  };

  const handleAddRoom = async (newRoom: {
    name: string;
    capacity: number;
    location: string;
    isActive: boolean;
    amenities: string[];
  }) => {
    addRoomMutation.mutate({
      name: newRoom.name,
      capacity: newRoom.capacity,
      location: newRoom.location,
      is_active: newRoom.isActive,
      amenities: newRoom.amenities,
      image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
      is_premium: false,
    });
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
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black">Rooms Management</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage and monitor all available meeting spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onToggle={() => toggleRoom(room.id, room.is_active)}
            onBook={() => handleBook(room)}
            isToggling={toggleRoomMutation.isPending && toggleRoomMutation.variables?.id === room.id}
          />
        ))}

        <button
          onClick={() => setOpenAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 gap-4 hover:bg-white hover:border-primary/40 transition-all group min-h-[300px]"
        >
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <span className="material-symbols-outlined !text-3xl">add</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-600 group-hover:text-primary">Add New Space</p>
            <p className="text-xs text-slate-400">Configure another room</p>
          </div>
        </button>
      </div>

      <ConfirmModal
        open={openConfirm}
        title="Confirm Booking"
        description={selectedRoom ? `Are you sure you want to book ${selectedRoom.name}?` : ""}
        loading={createBookingMutation.isPending}
        onConfirm={confirmBooking}
        onClose={() => {
          setOpenConfirm(false);
          setSelectedRoom(null);
        }}
      />

      <AddRoomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddRoom}
        loading={addRoomMutation.isPending}
      />
    </div>
  );
}

/* ---------------- Room Card ---------------- */

function RoomCard({
  room,
  onToggle,
  onBook,
  isToggling
}: {
  room: Room;
  onToggle: () => void;
  onBook: () => void;
  isToggling?: boolean;
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col ${!room.is_active ? "opacity-75 grayscale-[0.5]" : ""
        }`}
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {room.image_url ? (
          <img
            src={room.image_url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined !text-5xl">image</span>
          </div>
        )}

        {room.is_premium && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
              Premium
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold group-hover:text-primary transition-colors">
            {room.name}
          </h3>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-base">groups</span>
              {room.capacity} People
            </div>

            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-base text-primary">location_on</span>
              {room.location || "No location"}
            </div>
          </div>
        </div>

        {/* Amenities Icons */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-100"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-bold ml-1">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBook}
            disabled={!room.is_active}
            className={`text-sm font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline`}
          >
            Book
          </button>

          <label className={`relative inline-flex items-center cursor-pointer ${isToggling ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              type="checkbox"
              checked={room.is_active}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
