import { supabase } from "@/lib/supabase";

export type BookingStatus = "confirmed" | "cancelled" | "pending";

export type Booking = {
    id: string;
    room_id: string;
    user_id: string;
    title: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    created_at: string;
    // Joined fields
    rooms?: {
        name: string;
    };
    profiles?: {
        full_name: string;
        email: string;
    };
};

export async function getMyBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
      *,
      rooms ( name ),
      profiles ( full_name, email )
    `)
        .order("start_time", { ascending: true });

    if (error) throw error;
    return data as Booking[];
}

export async function createBooking(booking: {
    room_id: string;
    user_id: string;
    title: string;
    start_time: string;
    end_time: string;
}) {
    const { data, error } = await supabase
        .from("bookings")
        .insert([booking])
        .select()
        .single();

    if (error) throw error;
    return data as Booking;
}

export async function cancelBooking(id: string) {
    const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as Booking;
}
