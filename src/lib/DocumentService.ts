import { supabase } from "@/utils/SupabaseClient";
import { hashFileToBytes32 } from "../utils/FileUtils";

export const saveDocument = async (file: File | null, path: string): Promise<string> => {
  if (file != null) {
    try {
      const { data, error } = await supabase.storage.from("blokcejn-bucket").upload(`public/${path}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        throw error;
      }
      return data.path;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  } else throw new Error("File not present");
};

export const downloadDocument = async (path: string): Promise<Blob> => {
  try {
    const { data, error } = await supabase.storage.from("blokcejn-bucket").download(path);

    if (error) {
      throw error;
    }

    return data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

export const deleteDocuments = async (paths: string[]): Promise<any> => {
  try {
    const { data, error } = await supabase.storage.from("blokcejn-bucket").remove(paths);

    if (error) {
      throw error;
    }

    return data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

export const getFileNamesFromDirectory = async (path: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage.from("blokcejn-bucket").list(path);

    if (error) {
      throw error;
    }

    return data.map((file) => `${path}/${file.name}`);
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

export const getFileNamesWithHashesFromDirectory = async (path: string): Promise<object[]> => {
  try {
    const { data, error } = await supabase.storage.from("blokcejn-bucket").list(path);

    if (error) {
      throw error;
    }

    let files: object[] = [];
    for (let file of data) {
      files.push({
        id: `${path}/${file.name}`,
        documentHash: await hashFileToBytes32(new File([await downloadDocument(`${path}/${file.name}`)], file.name)),
      });
    }

    return files;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
