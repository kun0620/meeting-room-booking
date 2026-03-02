import { supabase } from "@/lib/supabase";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file The file to upload.
 * @param bucket The name of the storage bucket.
 * @returns The public URL of the uploaded file.
 */
export async function uploadImage(file: File, bucket: string = "room-images") {
    // Sanitize filename to prevent path traversal and collisions
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}
