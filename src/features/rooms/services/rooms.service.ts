import { supabase } from "@/lib/supabase";

export type Room = {
    id: string;
    name: string;
    capacity: number;
    location: string | null;
    image_url: string | null;
    is_active: boolean;
    is_premium: boolean;
    amenities: string[];
    created_at: string;
};

export async function getRooms() {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Room[];
}

export async function createRoom(room: Omit<Room, "id" | "created_at">) {
    const { data, error } = await supabase
        .from("rooms")
        .insert([room])
        .select()
        .single();

    if (error) throw error;
    return data as Room;
}

export async function updateRoom(id: string, updates: Partial<Room>) {
    const { data, error } = await supabase
        .from("rooms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as Room;
}
