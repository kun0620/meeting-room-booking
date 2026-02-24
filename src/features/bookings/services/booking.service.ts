import { supabase } from "@/lib/supabase";

export async function createBooking(data: any) {
  const { data: existing } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", data.room_id)
    .lt("start_time", data.end_time)
    .gt("end_time", data.start_time);

  if (existing && existing.length > 0) {
    throw new Error("Time slot already booked");
  }

  return supabase.from("bookings").insert(data);
}