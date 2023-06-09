import { supabase } from "@/utils/SupabaseClient";
import { hashFileToBytes32 } from "../utils/FileUtils";
import JSZip from "jszip";
import {saveAs} from 'file-saver';


export const saveDocument = async (file: File | null, path: string): Promise<string> => {
  if (file != null) {
    try {
      const { data, error } = await supabase.storage.from("blokcejn-bucket").upload(`public/${path}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
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

export const getFileNamesWithHashesFromDirectory = async (path: string): Promise<{ id: string; documentHash: string; owner?: string }[]> => {
  try {
    const { data, error } = await supabase.storage.from("blokcejn-bucket").list(path);

    if (error) {
      throw error;
    }

    let files: { id: string; documentHash: string; owner?: string }[] = [];
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

export const changeDocument = async (file: File, oldFilePath: string): Promise<string> => {
  try {
    await deleteDocuments([oldFilePath]);
    const dirPath: string = oldFilePath.substring(oldFilePath.indexOf("/") + 1, oldFilePath.lastIndexOf("/"));
    console.log(dirPath);
    return saveDocument(file, dirPath);
  } catch (e: any) {
    throw e;
  }
}

export const zipAndDownload = async (paths: string[], zipName: string): Promise<Blob> => {
  let files: File[] = [];
  try {
    for (let path of paths) {
      files.push(new File([await downloadDocument(path)], path.split('/').pop()!))
    }

    const zip = new JSZip();
    await Promise.all(
        files.map(async (file) => {
          const fileContent = await file.arrayBuffer();
          const fileName = file.name;
          zip.file(fileName, fileContent);
        })
    );

    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `${zipName}.zip`);
    });
  } catch (e: any) {
    throw e;
  }
}
