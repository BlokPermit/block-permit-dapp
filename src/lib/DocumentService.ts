import {supabase} from "@/util/SupabaseClient";
export const saveDocument = async (file: File) => {
    const { data, error } = await supabase.storage
        .from("blokcejn-bucket")
        .upload("public/image1", file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
        throw error;
    }

    return data.path;
};