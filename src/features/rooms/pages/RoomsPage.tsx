import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateBookingModal } from "@/components/ui/modal/CreateBookingModal";
import type { BookingFormData } from "@/components/ui/modal/CreateBookingModal";
import { AddRoomModal } from "@/components/ui/modal/AddRoomModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getRooms, createRoom, updateRoom } from "../services/rooms.service";
import { createBooking } from "@/features/bookings/services/bookings.service";
import { uploadImage } from "@/services/storage.service";
import type { Room } from "../services/rooms.service";

export default function RoomsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ─── Modal States ───────────────────────────────────────────────
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [bookingForRoom, setBookingForRoom] = useState<Room | null>(null);

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

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Room> }) =>
      updateRoom(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setEditingRoom(null);
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
      setBookingForRoom(null);
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
    setBookingForRoom(room);
  };

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


  const handleSaveRoom = async (formData: {
    name: string;
    capacity: number;
    location: string;
    isActive: boolean;
    amenities: string[];
    imageFile?: File | null;
  }) => {
    try {
      let image_url = editingRoom?.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200";

      // Upload image if a new file is provided
      if (formData.imageFile) {
        image_url = await uploadImage(formData.imageFile);
      }

      if (editingRoom) {
        updateRoomMutation.mutate({
          id: editingRoom.id,
          updates: {
            name: formData.name,
            capacity: formData.capacity,
            location: formData.location,
            is_active: formData.isActive,
            amenities: formData.amenities,
            image_url,
          }
        });
      } else {
        addRoomMutation.mutate({
          name: formData.name,
          capacity: formData.capacity,
          location: formData.location,
          is_active: formData.isActive,
          amenities: formData.amenities,
          image_url,
          is_premium: false,
        });
      }
    } catch (err: any) {
      alert(`Failed to save room: ${err.message}`);
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
    <div className="p-8 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Rooms Management</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Configure meeting spaces and available amenities.
          </p>
        </div>
        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined !text-xl">add</span>
          New Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={() => setEditingRoom(room)}
            onToggle={() => toggleRoom(room.id, room.is_active)}
            onBook={() => handleBook(room)}
            isToggling={toggleRoomMutation.isPending && toggleRoomMutation.variables?.id === room.id}
          />
        ))}

        <button
          onClick={() => setOpenAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 hover:bg-white hover:border-primary/40 transition-all group min-h-[300px]"
        >
          <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <span className="material-symbols-outlined !text-3xl">add</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-600 group-hover:text-primary">Create Another Space</p>
            <p className="text-xs text-slate-400 font-medium">Add room details manually</p>
          </div>
        </button>
      </div>

      {/* Booking Modal */}
      <CreateBookingModal
        open={!!bookingForRoom}
        onClose={() => setBookingForRoom(null)}
        onSubmit={handleBookingSubmit}
        rooms={rooms}
        initialData={bookingForRoom ? {
          title: "",
          roomId: bookingForRoom.id,
          date: new Date().toISOString().split('T')[0],
          startTime: "09:00",
          endTime: "10:00",
          description: "",
          participants: []
        } : undefined}
      />

      {/* Add/Edit Modal */}
      <AddRoomModal
        open={openAddModal || !!editingRoom}
        initialData={editingRoom || undefined}
        onClose={() => {
          setOpenAddModal(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
        loading={addRoomMutation.isPending || updateRoomMutation.isPending}
      />
    </div>
  );
}

/* ---------------- Room Card ---------------- */

function RoomCard({
  room,
  onEdit,
  onToggle,
  onBook,
  isToggling
}: {
  room: Room;
  onEdit: () => void;
  onToggle: () => void;
  onBook: () => void;
  isToggling?: boolean;
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col relative ${!room.is_active ? "opacity-75 grayscale-[0.3]" : ""
        }`}
    >
      {/* Edit Overlay Button */}
      <button
        onClick={onEdit}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-slate-600 hover:text-primary hover:bg-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
        title="Edit Room"
      >
        <span className="material-symbols-outlined !text-xl leading-none">edit</span>
      </button>

      <div className="relative h-44 overflow-hidden bg-slate-100">
        {room.image_url ? (
          <img
            src={room.image_url}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined !text-5xl">image</span>
          </div>
        )}

        {room.is_premium && (
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-inner">
              Premium
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-lg ${room.name.toLowerCase().includes("executive") || room.name.toLowerCase().includes("suite") ? "bg-purple-100 text-purple-600" :
                room.name.toLowerCase().includes("meeting") ? "bg-blue-100 text-blue-600" :
                  "bg-primary/10 text-primary"
                } flex items-center justify-center`}>
                <span className="material-symbols-outlined !text-lg">
                  {
                    room.name.toLowerCase().includes("executive") || room.name.toLowerCase().includes("suite") ? "workspace_premium" :
                      room.name.toLowerCase().includes("meeting") ? "groups" :
                        "meeting_room"
                  }
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors leading-tight">
                {room.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 text-[13px] text-slate-500 font-bold">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-base text-slate-400">groups</span>
              {room.capacity}
            </div>

            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-base text-primary/60">location_on</span>
              {room.location || "No location"}
            </div>
          </div>
        </div>

        {/* Amenities Icons */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-black border border-slate-100 uppercase tracking-tighter"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-black ml-0.5">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          <button
            onClick={onBook}
            disabled={!room.is_active}
            className={`text-sm font-black text-primary hover:underline underline-offset-4 disabled:opacity-30 disabled:no-underline px-1`}
          >
            BOOK NOW
          </button>

          <label className={`relative inline-flex items-center cursor-pointer ${isToggling ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              type="checkbox"
              checked={room.is_active}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-100 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
