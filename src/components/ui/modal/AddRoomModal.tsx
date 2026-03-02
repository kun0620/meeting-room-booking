import { useState, useEffect } from "react";
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
    imageFile?: File | null;
  }) => Promise<void> | void;
  initialData?: {
    name: string;
    capacity: number;
    location: string | null;
    amenities: string[];
    is_active: boolean;
    image_url: string | null;
  };
  loading?: boolean;
}

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
  initialData,
  loading: externalLoading,
}: AddRoomModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityList, setAmenityList] = useState<string[]>(DEFAULT_AMENITIES);
  const [newAmenity, setNewAmenity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading ?? internalLoading;
  const isEditing = !!initialData;

  // ─── Sync State with Initial Data ───────────────────────────────
  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setCapacity(initialData?.capacity ?? 0);
      setLocation(initialData?.location ?? "");
      setAmenities(initialData?.amenities ?? []);
      setIsActive(initialData?.is_active ?? true);
      setImagePreview(initialData?.image_url ?? null);
      setImageFile(null);

      // Merge initial amenities into the list if they aren't there
      if (initialData?.amenities) {
        setAmenityList(prev => {
          const combined = [...new Set([...prev, ...initialData.amenities])];
          return combined;
        });
      }
    }
  }, [open, initialData]);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        imageFile,
      });
      if (!isEditing) {
        // Reset only if creating new
        setName("");
        setCapacity(0);
        setLocation("");
        setAmenities([]);
        setImageFile(null);
        setImagePreview(null);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold">{isEditing ? "Edit Room" : "Add Room"}</h2>
          <button onClick={onClose} className="hover:text-rose-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold mb-3 self-start">Room Image</label>
            <div
              className="relative w-full h-48 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group cursor-pointer hover:border-primary/40 transition-all"
              onClick={() => document.getElementById('room-image-input')?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold">
                    <span className="material-symbols-outlined">upload</span>
                    Change Image
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <span className="material-symbols-outlined !text-4xl text-slate-300">add_a_photo</span>
                  <p className="text-xs font-bold">Click to upload room cover</p>
                </div>
              )}
              <input
                id="room-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Room Name */}
          <div>
            <label className="text-sm font-semibold">Room Name</label>
            <input
              className="w-full mt-2 p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Innovation Hub"
            />
          </div>

          {/* Capacity + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Capacity</label>
              <input
                type="number"
                className="w-full mt-2 p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Location</label>
              <input
                className="w-full mt-2 p-3 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Floor 4, Wing A"
              />
            </div>
          </div>

          {/* Amenities Section */}
          <div>
            <label className="text-sm font-semibold">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-3">
              {amenityList.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${amenities.includes(a)
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-slate-200 hover:border-primary/40"
                    }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add other amenity..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newAmenity.trim()) return;
                  if (!amenityList.includes(newAmenity)) {
                    setAmenityList((prev) => [...prev, newAmenity]);
                  }
                  if (!amenities.includes(newAmenity)) {
                    setAmenities((prev) => [...prev, newAmenity]);
                  }
                  setNewAmenity("");
                }}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-lg text-sm font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
            <div>
              <p className="text-sm font-bold">Active Status</p>
              <p className="text-xs text-slate-500">Available for booking immediately</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-8 py-6 border-t bg-slate-50">
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold disabled:opacity-60 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {loading ? "Processing..." : isEditing ? "Update Room" : "Create Room"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
