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
  status: "confirmed" | "pending";
  participants: Participant[];
};

/* 👇 ใช้เฉพาะ Calendar layout */
export type CalendarBooking = Booking & {
  dayIndex: number;
  top: number;
  height: number;
};