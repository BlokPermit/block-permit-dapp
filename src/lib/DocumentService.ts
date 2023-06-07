import {supabase} from "@/utils/SupabaseClient";

export const saveDocument = async (file: File | null, path: string) => {
    if (file != null) {
        const {data, error} = await supabase.storage
            .from("blokcejn-bucket")
            .upload(`public/${path}/${file.name}`, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            return false;
        }
        return data.path;
    } else return false;
};

export const downloadDocument = async (path: string): Promise<Blob | boolean> => {
    const {data, error} = await supabase.storage
        .from("blokcejn-bucket")
        .download(path);

    if (error) {
        return false;
    }

    return data;
}