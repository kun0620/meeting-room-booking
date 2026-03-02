import { supabase } from "@/lib/supabase";

export type BookingStatus = "confirmed" | "cancelled" | "pending";

export type Booking = {
    id: string;
    room_id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    created_at: string;
    // Joined fields
    rooms?: {
        name: string;
        amenities: string[];
    };
    profiles?: {
        full_name: string;
        email: string;
        avatar_url?: string;
    };
    booking_participants?: {
        id: string;
        user_id: string;
        profiles: {
            full_name: string;
            avatar_url: string;
        };
    }[];
};

export async function getBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            rooms ( name, amenities ),
            profiles ( full_name, email, avatar_url ),
            booking_participants (
                id,
                user_id,
                profiles ( full_name, avatar_url )
            )
        `)
        .order("start_time", { ascending: true });

    if (error) throw error;
    return data as Booking[];
}

export async function getMyBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            rooms ( name, amenities ),
            profiles ( full_name, email, avatar_url ),
            booking_participants (
                id,
                user_id,
                profiles ( full_name, avatar_url )
            )
        `)
        .order("start_time", { ascending: true }); // Filter by user_id logic is usually handled by RLS, but we can add .eq('user_id', ...) if needed

    if (error) throw error;
    return data as Booking[];
}

export async function createBooking(payload: {
    room_id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    participant_ids?: string[]; // IDs of selected users
}) {
    const { participant_ids, ...bookingData } = payload;

    // 1. Insert the main booking
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 2. Insert participants if any
    if (participant_ids && participant_ids.length > 0) {
        const participantEntries = participant_ids.map(uid => ({
            booking_id: booking.id,
            user_id: uid
        }));

        const { error: partError } = await supabase
            .from("booking_participants")
            .insert(participantEntries);

        if (partError) {
            console.error("Error saving participants:", partError);
            // We don't necessarily roll back the booking, but we log the error
        }
    }

    return booking as Booking;
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

export async function updateBooking(id: string, payload: Partial<{
    room_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    participant_ids?: string[];
}>) {
    const { participant_ids, ...bookingData } = payload;

    // 1. Update the main booking
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .update(bookingData)
        .eq("id", id)
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 2. Sync participants if provided
    if (participant_ids) {
        // Delete existing participants
        await supabase.from("booking_participants").delete().eq("booking_id", id);

        // Re-insert if requested
        if (participant_ids.length > 0) {
            const participantEntries = participant_ids.map(uid => ({
                booking_id: id,
                user_id: uid
            }));

            await supabase.from("booking_participants").insert(participantEntries);
        }
    }

    return booking as Booking;
}
