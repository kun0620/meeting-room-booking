export type Participant = {
  id: string;
  name: string;
  role: string;
};

export type Booking = {
  id: string;
  title: string;
  room: string;
  date: string;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled" | "pending";
  participants: Participant[];
  profiles?: {
    full_name: string;
    email: string;
  };
  rooms?: {
    name: string;
    amenities: string[];
  };
};

/* 👇 ใช้เฉพาะ Calendar layout */
export type CalendarBooking = Booking & {
  dayIndex: number;
  top: number;
  height: number;
  room_id: string;
  amenities?: string[];
};