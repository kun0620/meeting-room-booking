import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface AddRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (room: {
    name: string;
    capacity: number;
    location: string;
    amenities: string[];
    isActive: boolean;
  }) => Promise<void> | void;
  loading?: boolean;
}

// 🔧 FIX: เปลี่ยนชื่อเป็น DEFAULT_AMENITIES เพื่อชัดเจนว่าเป็นค่าเริ่มต้น
const DEFAULT_AMENITIES = [
  "WiFi",
  "4K Display",
  "Video Conf.",
  "Projector",
  "Whiteboard",
];

export function AddRoomModal({
  open,
  onClose,
  onSave,
  loading: externalLoading,
}: AddRoomModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState("");

  // 🔧 FIX: แยก state สำหรับ selected amenities
  const [amenities, setAmenities] = useState<string[]>([]);

  // 🔧 FIX: แยก state สำหรับรายการ amenity ทั้งหมด (รวมที่เพิ่มใหม่)
  const [amenityList, setAmenityList] = useState<string[]>(
    DEFAULT_AMENITIES
  );

  // 🔧 FIX: state สำหรับ input เพิ่ม amenity ใหม่
  const [newAmenity, setNewAmenity] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading ?? internalLoading;

  // 🔧 FIX: toggle เลือก / ยกเลิก amenity
  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a)
        ? prev.filter((x) => x !== a)
        : [...prev, a]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || capacity <= 0) {
      alert("Please fill required fields.");
      return;
    }

    setInternalLoading(true);

    try {
      await onSave({
        name,
        capacity,
        location,
        amenities,
        isActive,
      });

      // 🔧 FIX: reset form หลัง save
      setName("");
      setCapacity(0);
      setLocation("");
      setAmenities([]);
      setNewAmenity("");
      setAmenityList(DEFAULT_AMENITIES);
      setIsActive(true);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold">Add Room</h2>
          <button onClick={onClose}>
            <span className="material-symbols-outlined">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Room Name */}
          <div>
            <label className="text-sm font-semibold">
              Room Name
            </label>
            <input
              className="w-full mt-2 p-3 rounded-lg border"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Innovation Hub"
            />
          </div>

          {/* Capacity + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">
                Capacity
              </label>
              <input
                type="number"
                className="w-full mt-2 p-3 rounded-lg border"
                value={capacity}
                onChange={(e) =>
                  setCapacity(Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Location
              </label>
              <input
                className="w-full mt-2 p-3 rounded-lg border"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />
            </div>
          </div>

          {/* 🔧 FIX: Amenities Section (local structure แบบง่าย) */}
          <div>
            <label className="text-sm font-semibold">
              Amenities
            </label>

            <div className="flex flex-wrap gap-2 mt-3">
              {amenityList.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${amenities.includes(a)
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-slate-200"
                    }`}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* ➕ ADD: เพิ่ม amenity ใหม่ */}
            <div className="flex gap-2 mt-4">
              <input
                value={newAmenity}
                onChange={(e) =>
                  setNewAmenity(e.target.value)
                }
                placeholder="Add new amenity"
                className="flex-1 px-3 py-2 text-sm rounded-lg border"
              />

              <button
                type="button"
                onClick={() => {
                  if (!newAmenity.trim()) return;

                  if (!amenityList.includes(newAmenity)) {
                    setAmenityList((prev) => [
                      ...prev,
                      newAmenity,
                    ]);
                  }

                  setNewAmenity("");
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
            <div>
              <p className="text-sm font-bold">
                Active Status
              </p>
              <p className="text-xs text-slate-500">
                Available for booking immediately
              </p>
            </div>

            <input
              type="checkbox"
              checked={isActive}
              onChange={() =>
                setIsActive((prev) => !prev)
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-8 py-6 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Room"}
          </button>
        </div>

      </div>
    </BaseModal>
  );
}