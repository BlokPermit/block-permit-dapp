import {supabase} from "@/utils/SupabaseClient";

export const saveDocument = async (file: File | null, path: string) => {
    if (file != null) {
        try {
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
        } catch (e: any) {
            console.log(e);
            throw e;
        }
    } else return false;
};

export const downloadDocument = async (path: string): Promise<Blob | boolean> => {
    try {
        const {data, error} = await supabase.storage
            .from("blokcejn-bucket")
            .download(path);

        if (error) {
            return false;
        }

        return data;
    } catch (e: any) {
        console.log(e);
        throw e;
    }
}

export const getAllFilesInDirectory = async (path: string): Promise<string[] | boolean> => {
    try {
        const {data, error} = await supabase.storage
            .from("blokcejn-bucket")
            .list(path);

        if (error) {
            return false;
        }

        console.log(data);
        return data.map(file => `${path}/${file.name}`);
    } catch (e: any) {
        console.log(e);
        throw e;
    }
}