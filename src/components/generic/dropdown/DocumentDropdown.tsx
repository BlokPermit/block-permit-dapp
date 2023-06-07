import { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { FaArrowUp, FaChevronDown, FaChevronUp, FaFileDownload, FaFileUpload, FaTrash } from "react-icons/fa";
import { downloadDocument, saveDocument } from "@/lib/DocumentService";
import useAlert from "@/hooks/AlertHook";
import DocumentInput from "../input/DocumentInput";
import IconButton from "../buttons/IconButton";

interface DocumentDropdownProps {
  documentId: string;
  documentType: "dpp" | "dgd";
  isPresent: boolean;
  fileName?: string;
  onDocumentChange: (file: File | null) => void;
}

const DocumentDownload = (props: DocumentDropdownProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { setAlert } = useAlert();

  async function downloadFile() {
    try {
      if (props.fileName != null) {
        const file: Blob | boolean = await downloadDocument(props.fileName);
        if (file == false) throw Error("Failed to download document. Please try again.");

        const blobURL = window.URL.createObjectURL(file as Blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.setAttribute("download", props.fileName);
        downloadLink.click();
      }
    } catch (error: Error | any) {
      setAlert({ title: "", message: error.message, type: "error" });
    }
  }

  return (
    <div>
      <div className="inline-flex items-center overflow-hidde bg-main-200 hover:bg-white rounded-md border text-sm hover:cursor-pointer">
        <span className="inline-flex items-center border-e px-4 py-2 bg-main-200 hover:bg-white text-white hover:text-main-200">
          <FaFileDownload className="mr-2" />
          {props.documentType === "dpp" && <p>Download DPP</p>}
          {props.documentType === "dgd" && <p>Download DGD</p>}
        </span>

        <span onClick={() => setIsActive(!isActive)} className="py-2 px-2 bg-main-200 hover:bg-white text-white hover:text-main-200">
          {isActive ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <div className={!isActive ? "hidden" : "absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"} role="menu">
        <div className="p-2">
          <strong className="block p-2 text-xs font-medium uppercase text-gray-400">General</strong>

          <button onClick={downloadFile} className="w-full text-left block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" role="menuitem">
            Download
          </button>

          <button className="w-full text-left block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" role="menuitem">
            Update
          </button>
        </div>

        <div className="p-2">
          <strong className="block p-2 text-xs font-medium uppercase text-gray-400">Danger Zone</strong>

          <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50" role="menuitem">
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentUpload = (props: DocumentDropdownProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { setAlert } = useAlert();

  const handleDocumentChange = (file: File | null) => {
    setFile(file);
  };

  const uploadDocument = () => {
    try {
      if (file) {
        saveDocument(file);
        setIsActive(false);
        setAlert({ title: "Success", message: "DPP is set", type: "success" });
        props.onDocumentChange(file);
      }
      setAlert({ title: "Warning", message: "No file selected", type: "warning" });
    } catch (e: any) {
      setAlert({ title: "Error", message: e.message, type: "error" });
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsActive(!isActive)}
        className="inline-flex items-center overflow-hidden rounded-md border bg-main-200 hover:cursor-pointer hover:bg-gray-50 text-white hover:text-main-200"
      >
        <span className="flex justify-between items-center px-2 py-2 text-sm text-inherit">
          <FaFileUpload className="mr-2" size={19} />
          {props.documentType === "dpp" && <p>Upload DPP</p>}
          {props.documentType === "dgd" && <p>Upload DGD</p>}
        </span>

        <span className="h-full p-2 text-inherit">{isActive ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}</span>
      </div>

      <div className={!isActive ? "hidden" : "absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"} role="menu">
        <DocumentInput onDocumentChange={handleDocumentChange} />
        {file && (
          <div className="p-3 flex justify-end">
            <IconButton className="bg-main-200 text-white hover:bg-white hover:text-main-200" text={"Upload"} icon={<FaArrowUp />} onClick={uploadDocument} />
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentDropdown = (props: DocumentDropdownProps) => {
  return (
    <>
      {props.isPresent ? (
        <DocumentDownload documentId={props.documentId} documentType={props.documentType} isPresent={props.isPresent} fileName={props.fileName} onDocumentChange={props.onDocumentChange} />
      ) : (
        <DocumentUpload documentId={props.documentId} documentType={props.documentType} isPresent={props.isPresent} onDocumentChange={props.onDocumentChange} />
      )}
    </>
  );
};

export default DocumentDropdown;
