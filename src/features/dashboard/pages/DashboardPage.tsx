import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, differenceInMinutes } from "date-fns";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AppUser } from "@/features/auth/hooks/useAuth";

import { getRooms } from "@/features/rooms/services/rooms.service";
import { getMyBookings, createBooking } from "@/features/bookings/services/bookings.service";
import { WeeklyUsageChart } from "../components/WeeklyUsageChart";
import { NextBookingsList } from "../components/NextBookingsList";
import { CreateBookingModal } from "@/components/ui/modal/CreateBookingModal";
import type { BookingFormData } from "@/components/ui/modal/CreateBookingModal";

export function DashboardPage() {
  const { user } = useAuth() as { user: AppUser | null };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ─── Data Fetching ────────────────────────────────────────────────
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const activeRooms = rooms.filter(r => r.is_active).length;
  const todayBookings = bookings.filter(b => {
    const start = new Date(b.start_time);
    const today = new Date();
    return start.toDateString() === today.toDateString() && b.status !== 'cancelled';
  }).length;

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!user) return;

    try {
      await createBooking({
        room_id: data.roomId,
        user_id: user.id,
        title: data.title,
        description: data.description,
        start_time: `${data.date}T${data.startTime}:00`,
        end_time: `${data.date}T${data.endTime}:00`,
        participant_ids: data.participants.map(p => p.id),
      });

      setIsModalOpen(false); // Close modal on success

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book room. Please try again.");
    }
  };

  return (
    <div className="p-8">

      {/* Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Hi, {user?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Here's what's happening today in the office.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span>Book a Room</span>
        </button>
      </div>

      <CreateBookingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookingSubmit}
        rooms={rooms}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon="meeting_room"
          label="Available Rooms"
          value={activeRooms.toString()}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon="event_available"
          label="Today's Bookings"
          value={todayBookings.toString()}
          color="text-primary"
          bg="bg-primary/5"
        />
        <StatCard
          icon="corporate_fare"
          label="Total Capacity"
          value={rooms.length.toString()}
          color="text-slate-600"
          bg="bg-slate-50"
        />
      </div>

      {/* Next Meeting Hero */}
      {(() => {
        const now = new Date();
        const nextMeeting = bookings
          .filter(b => b.status !== 'cancelled' && new Date(b.end_time) > now)
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

        if (!nextMeeting) return null;

        const isLive = new Date(nextMeeting.start_time) <= now;

        return (
          <div className="mb-10 p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border ${isLive ? 'border-emerald-500/50' : 'border-white/10'}`}>
                  <span className={`size-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-primary'} animate-pulse`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    {isLive ? "Currently Live" : "Up Next"}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors duration-500">
                    {nextMeeting.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/60 font-bold text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined !text-base">location_on</span>
                      {nextMeeting.rooms?.name}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5 text-primary-foreground/90">
                      <span className="material-symbols-outlined !text-base text-primary">schedule</span>
                      {new Date(nextMeeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest">
                    {isLive ? "Ends At" : "Starting In"}
                  </p>
                  <p className={`text-2xl font-black ${isLive ? 'text-emerald-400' : 'text-white'}`}>
                    {isLive
                      ? format(new Date(nextMeeting.end_time), "p")
                      : `${differenceInMinutes(new Date(nextMeeting.start_time), now)} Mins`}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/app/calendar')}
                  className={`${isLive ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/30'} text-white h-14 px-6 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl font-bold uppercase tracking-widest text-xs group/btn`}
                >
                  <span>{isLive ? "Join Now" : "Details"}</span>
                  <span className="material-symbols-outlined !text-xl group-hover/btn:rotate-45 transition-transform">arrow_outward</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Chart + List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-3">
          <WeeklyUsageChart />
        </div>

        <div className="lg:col-span-2">
          <NextBookingsList />
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickCard icon="map" label="Floor Map" />
        <QuickCard icon="group" label="Teams" />
        <QuickCard icon="inventory_2" label="Resources" />
        <QuickCard icon="support_agent" label="IT Support" />
      </div>
    </div>
  );
}

/* ---------- Quick Card Component ---------- */

function QuickCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-primary/40 cursor-pointer transition-all group shadow-sm hover:shadow-md">
      <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
        {label}
      </span>
    </div>
  );
}

/* ---------- Stat Card Component ---------- */

function StatCard({ icon, label, value, color, bg }: {
  icon: string;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`size-12 rounded-2xl ${bg} flex items-center justify-center ${color}`}>
          <span className="material-symbols-outlined !text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
