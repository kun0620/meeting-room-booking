// src/components/ui/modal/CreateBookingModal.tsx

import { useState, useMemo } from "react";
import { BaseModal } from "./BaseModal";
import type { Room } from "@/features/rooms/services/rooms.service";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";

interface CreateBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
  rooms?: Room[];
  initialData?: BookingFormData & { id?: string }; // Added id for editing
}

export type BookingFormData = {
  title: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  participants: Participant[];
};

type Participant = {
  id: string;
  name: string;
  avatar?: string;
};

export function CreateBookingModal({
  open,
  onClose,
  onSubmit,
  rooms = [],
  initialData,
}: CreateBookingModalProps) {

  // 👉 form state
  const [form, setForm] = useState<BookingFormData>(() => {
    if (initialData) return initialData;

    return {
      title: "",
      roomId: rooms[0]?.id || "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:30",
      description: "",
      participants: [
        { id: '1', name: 'Felix', avatar: 'https://i.pravatar.cc/150?u=felix' },
        { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' }
      ]
    };
  });

  // Effect to reset form when initialData changes or modal opens
  useMemo(() => {
    if (open) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({
          title: "",
          roomId: rooms[0]?.id || "",
          date: format(new Date(), "yyyy-MM-dd"),
          startTime: "09:00",
          endTime: "10:30",
          description: "",
          participants: [
            { id: '1', name: 'Felix', avatar: 'https://i.pravatar.cc/150?u=felix' },
            { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' }
          ]
        });
      }
    }
  }, [open, initialData, rooms]);

  const selectedRoom = useMemo(() => rooms.find(r => r.id === form.roomId), [rooms, form.roomId]);

  const handleChange = (key: keyof BookingFormData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeParticipant = (id: string) => {
    setForm(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!form.title || !form.roomId || !form.date) {
      alert("Please fill in meeting title and select a room.");
      return;
    }
    if (onSubmit) onSubmit(form);
    onClose();
  };

  // ─── Custom Calendar Logic ─────────────────────────────────────────
  const [viewDate, setViewDate] = useState(new Date());
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-3xl">

      <div className="flex flex-col bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 size-12 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                calendar_add_on
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {initialData?.id ? "Update Booking" : "Create New Booking"}
              </h2>
              <p className="text-slate-400 text-xs font-medium">
                {initialData?.id ? "Modify your existing reservation" : "Schedule your next collaboration session"}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-300 transition-colors">
            <span className="material-symbols-outlined text-xl">
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Meeting Title
              </label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full h-12 rounded-[20px] border border-slate-100 bg-slate-50/50 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-300 shadow-sm shadow-slate-100/50"
                placeholder="Project Kickoff..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Room Selector
              </label>
              <div className="relative group">
                <select
                  value={form.roomId}
                  onChange={(e) => handleChange("roomId", e.target.value)}
                  className="w-full h-12 rounded-[20px] border border-slate-100 bg-slate-50/50 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none cursor-pointer shadow-sm shadow-slate-100/50"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} {room.location ? ` - ${room.location}` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors !text-xl">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Date
              </label>
              <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4">
                <div className="flex items-center justify-between mb-4 px-1">
                  <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="size-7 rounded-lg hover:bg-white text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <span className="text-sm font-black text-slate-800">
                    {format(viewDate, "MMMM yyyy")}
                  </span>
                  <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="size-7 rounded-lg hover:bg-white text-slate-400 hover:text-primary transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const isSelected = isSameDay(day, new Date(form.date));
                    const isCurrentMonth = day.getMonth() === monthStart.getMonth();

                    return (
                      <button
                        key={day.toString()}
                        type="button"
                        onClick={() => handleChange("date", format(day, "yyyy-MM-dd"))}
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                          : isCurrentMonth ? "text-slate-700 hover:bg-white" : "text-slate-200"
                          }`}
                      >
                        {format(day, "d")}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    className="w-full h-12 rounded-[20px] border border-slate-100 bg-slate-50/50 px-5 text-xs font-black focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none shadow-sm shadow-slate-100/50"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                    schedule
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    className="w-full h-12 rounded-[20px] border border-slate-100 bg-slate-50/50 px-5 text-xs font-black focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none shadow-sm shadow-slate-100/50"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                    schedule
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Add Participants
              </label>
              <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-3 min-h-[50px] shadow-sm shadow-slate-100/50">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.participants.map(p => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-white border border-slate-100 px-1.5 py-1 rounded-[10px] shadow-sm">
                      <img src={p.avatar} alt={p.name} className="size-5 rounded-lg object-cover" />
                      <span className="text-[10px] font-black text-slate-700">{p.name}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(p.id)}
                        className="material-symbols-outlined !text-[12px] text-slate-300 hover:text-red-400 transition-colors"
                      >
                        close
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  placeholder="Search team members..."
                  className="bg-transparent w-full px-1.5 text-[11px] font-bold text-slate-400 focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Meeting Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full mt-1 rounded-[28px] border border-slate-100 bg-slate-50/50 px-5 py-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none placeholder:text-slate-300 shadow-sm shadow-slate-100/50"
                placeholder="Outline the goals of this session..."
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-[20px] bg-primary/[0.03] border border-primary/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 size-10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">event_repeat</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Recurring Meeting</h4>
                  <p className="text-[9px] text-slate-400 font-medium">Repeat weekly on {format(new Date(form.date), "EEEE")}s</p>
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </div>

            {selectedRoom && (
              <div className="space-y-3">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Room Features</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.amenities.map(a => {
                    let icon = "check_circle";
                    if (a.toLowerCase().includes("display")) icon = "monitor";
                    if (a.toLowerCase().includes("video")) icon = "videocam";
                    if (a.toLowerCase().includes("person")) icon = "group";

                    return (
                      <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/50 border border-slate-200/30">
                        <span className="material-symbols-outlined text-slate-400 !text-xs">{icon}</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{a}</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/50 border border-slate-200/30">
                    <span className="material-symbols-outlined text-slate-400 !text-xs">group</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{selectedRoom.capacity} Persons</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex justify-end gap-5 items-center">
          <button
            onClick={onClose}
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition-all px-4 tracking-wider uppercase"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-4 rounded-[24px] bg-primary text-white text-xs font-black shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
          >
            <span className="material-symbols-outlined !text-base">
              {initialData?.id ? "save" : "check_circle"}
            </span>
            <span>{initialData?.id ? "Save Changes" : "Book Room"}</span>
          </button>
        </div>

      </div>
    </BaseModal>
  );
}