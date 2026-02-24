// src/components/ui/modal/CreateBookingModal.tsx

import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface CreateBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
}

export type BookingFormData = {
  title: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  recurring: boolean;
};

export function CreateBookingModal({
  open,
  onClose,
  onSubmit,
}: CreateBookingModalProps) {

  // 👉 form state
  const [form, setForm] = useState<BookingFormData>({
    title: "",
    room: "Innovation Hub - Floor 2",
    date: "",
    startTime: "09:00",
    endTime: "10:30",
    description: "",
    recurring: false,
  });

  const handleChange = (key: keyof BookingFormData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(form);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-3xl">

      <div className="flex flex-col">

        {/* ========================= */}
        {/* Header */}
        {/* ========================= */}

        <div className="flex items-center justify-between px-8 py-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">
                calendar_add_on
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Create New Booking
              </h2>
              <p className="text-slate-500 text-sm">
                Schedule your next collaboration session
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <span className="material-symbols-outlined">
              close
            </span>
          </button>
        </div>

        {/* ========================= */}
        {/* Body */}
        {/* ========================= */}

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            <div>
              <label className="text-sm font-semibold">
                Meeting Title
              </label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full h-12 mt-2 rounded-lg border bg-slate-50 px-3"
                placeholder="Project Kickoff..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Room
              </label>
              <select
                value={form.room}
                onChange={(e) => handleChange("room", e.target.value)}
                className="w-full h-12 mt-2 rounded-lg border bg-slate-50 px-3"
              >
                <option>Innovation Hub - Floor 2</option>
                <option>The War Room - Floor 1</option>
                <option>Zen Lounge - Floor 4</option>
                <option>Boardroom A - Floor 5</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Date
              </label>
              <div>
                <label className="text-sm font-semibold">
                    Date
                </label>

                <div className="relative mt-2">
                    <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    />

                    {/* Icon */}
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    calendar_today
                    </span>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">
                  Start Time
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="w-full h-12 mt-2 rounded-lg border bg-slate-50 px-3"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  End Time
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  className="w-full h-12 mt-2 rounded-lg border bg-slate-50 px-3"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            <div>
              <label className="text-sm font-semibold">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full mt-2 rounded-lg border bg-slate-50 px-3 py-2 resize-none"
                placeholder="Outline the goals..."
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border">
              <div>
                <p className="text-sm font-semibold">
                  Recurring Meeting
                </p>
                <p className="text-xs text-slate-500">
                  Repeat weekly
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.recurring}
                onChange={(e) => handleChange("recurring", e.target.checked)}
              />
            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* Footer */}
        {/* ========================= */}

        <div className="px-8 py-6 border-t flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            Book Room
          </button>
        </div>

      </div>
    </BaseModal>
  );
}