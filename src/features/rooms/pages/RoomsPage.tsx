import { useState } from "react";
import { ConfirmModal } from "@/components/ui/modal/ConfirmModal";
import { AddRoomModal } from "@/components/ui/modal/AddRoomModal";

type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  image: string;
  isActive: boolean;
  premium?: boolean;
};

export default function RoomsPage() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Apollo Boardroom",
      capacity: 12,
      location: "Floor 2, East",
      image:
        "https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=1200",
      isActive: true,
      premium: true,
    },
    {
      id: "2",
      name: "Zen Den",
      capacity: 4,
      location: "Floor 1, Suite 101",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
      isActive: true,
    },
    {
      id: "3",
      name: "Workshop Lab",
      capacity: 20,
      location: "Floor 3, West",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
      isActive: false,
    },
  ]);

  const toggleRoom = (id: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  const handleBook = (room: Room) => {
    setSelectedRoom(room);
    setOpenConfirm(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom) return;

    setLoading(true);

    // simulate API
    await new Promise((res) => setTimeout(res, 1200));

    console.log("Booked:", selectedRoom.name);

    setLoading(false);
    setOpenConfirm(false);
    setSelectedRoom(null);
  };

  const handleAddRoom = async (newRoom: {
    name: string;
    capacity: number;
    location: string;
    amenities: string[];
    isActive: boolean;
    }) => {
    const room: Room = {
        id: crypto.randomUUID(),
        name: newRoom.name,
        capacity: newRoom.capacity,
        location: newRoom.location,
        image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
        isActive: newRoom.isActive,
    };

    setRooms((prev) => [...prev, room]);
    };

  return (
    <div className="p-8 overflow-y-auto">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-black">
          Rooms Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage and monitor all available meeting spaces.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onToggle={() => toggleRoom(room.id)}
            onBook={() => handleBook(room)}
          />
        ))}

        {/* Add New Card */}
        <button
        onClick={() => setOpenAddModal(true)}
        className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 gap-4 hover:bg-white hover:border-primary/40 transition-all group"
        >
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <span className="material-symbols-outlined !text-3xl">
              add
            </span>
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-600 group-hover:text-primary">
              Add New Space
            </p>
            <p className="text-xs text-slate-400">
              Configure another room
            </p>
          </div>
        </button>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={openConfirm}
        title="Confirm Booking"
        description={
          selectedRoom
            ? `Are you sure you want to book ${selectedRoom.name}?`
            : ""
        }
        loading={loading}
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
        />

    </div>
  );
}

/* ---------------- Room Card ---------------- */

type CardProps = {
  room: Room;
  onToggle: () => void;
  onBook: () => void;
};

function RoomCard({ room, onToggle, onBook }: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col ${
        !room.isActive ? "opacity-75 grayscale-[0.5]" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {room.premium && (
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
              <span className="material-symbols-outlined !text-base">
                groups
              </span>
              {room.capacity} People
            </div>

            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-base text-primary">
                location_on
              </span>
              {room.location}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBook}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Book
          </button>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={room.isActive}
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