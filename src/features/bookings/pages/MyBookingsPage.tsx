import { useState } from "react";
import { DangerModal } from "@/components/ui/modal/DangerModal";
import { CreateBookingModal } from "@/components/ui/modal/CreateBookingModal";
import type { BookingFormData } from "@/components/ui/modal/CreateBookingModal";
type Booking = {
  id: string;
  room: string;
  title: string;
  date: string;
  time: string;
  status: "confirmed" | "upcoming";
};

export default function MyBookingsPage() {

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  // 🔥 แก้ตรงนี้ (เพิ่ม setBookings)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      room: "Conference Room A",
      title: "Quarterly Sprint Planning",
      date: "Oct 24, 2023",
      time: "10:00 AM - 11:30 AM",
      status: "confirmed",
    },
    {
      id: "2",
      room: "Meeting Room 2",
      title: "Design System Review",
      date: "Oct 25, 2023",
      time: "02:00 PM - 03:00 PM",
      status: "upcoming",
    },
  ]);

  return (
    <div className="p-8">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            My Bookings
          </h2>
          <p className="text-slate-500 mt-1">
            Manage and track your upcoming room reservations.
          </p>
        </div>

        {/* 🔥 เพิ่มปุ่มตรงนี้ */}
        <button
          onClick={() => setOpenCreate(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">
            add
          </span>
          Book Room
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Room
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Title
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Time
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold">
                    {b.room}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.date}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {b.time}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setOpenDelete(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE MODAL ================= */}

      <CreateBookingModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(data: BookingFormData) => {
          // 🔥 เพิ่ม booking เข้า table จริง

          const newBooking: Booking = {
            id: Date.now().toString(),
            room: data.room,
            title: data.title,
            date: data.date,
            time: `${data.startTime} - ${data.endTime}`,
            status: "upcoming",
          };

          setBookings((prev) => [newBooking, ...prev]);
        }}
      />

      {/* ================= DELETE MODAL ================= */}

      <DangerModal
        open={openDelete}
        title="Delete Booking"
        description="This action cannot be undone."
        reference={selectedBooking?.title}
        loading={loadingDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {

          if (!selectedBooking) return;

          setLoadingDelete(true);

          // 🔥 ลบจริง
          setBookings((prev) =>
            prev.filter((b) => b.id !== selectedBooking.id)
          );

          await new Promise((res) => setTimeout(res, 600));

          setLoadingDelete(false);
          setOpenDelete(false);
          setSelectedBooking(null);
        }}
      />

    </div>
  );
}

/* ========================= */
/* Status Badge              */
/* ========================= */

function StatusBadge({ status }: { status: "confirmed" | "upcoming" }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        Confirmed
      </span>
    );
  }

  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
      Upcoming
    </span>
  );
}