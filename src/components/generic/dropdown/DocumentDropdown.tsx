import { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { FaChevronDown, FaChevronUp, FaFileDownload, FaFileUpload, FaTrash } from "react-icons/fa";

interface DocumentDropdownProps {
  documentId: string;
  documentType: "dpp" | "dgd";
  isPresent: boolean;
  onDocumentChange: (file: File | null) => void;
}

const DocumentDownload = (props: DocumentDropdownProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div className="relative">
      <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
        <span className="flex justify-between border-e px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700">
          <FaFileDownload className="mr-2" />
          {props.documentType === "dpp" && <p>Download DPP</p>}
          {props.documentType === "dgd" && <p>Download DGD</p>}
        </span>

        <button onClick={() => setIsActive(!isActive)} className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700">
          <span className="sr-only">Menu</span>
          {isActive ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </button>
      </div>

      <div className={!isActive ? "hidden" : "absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"} role="menu">
        <div className="p-2">
          <strong className="block p-2 text-xs font-medium uppercase text-gray-400">General</strong>

          <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" role="menuitem">
            Download
          </a>

          <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" role="menuitem">
            Update
          </a>
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

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    props.onDocumentChange(file);
  };

  return (
    <div className="relative">
      <div onClick={() => setIsActive(!isActive)} className="inline-flex items-center overflow-hidden rounded-md border bg-white hover:cursor-pointer hover:bg-gray-50 hover:text-gray-700">
        <span className="flex justify-between px-2 py-2 text-sm/none text-gray-600">
          <FaFileUpload className="mr-2" />
          {props.documentType === "dpp" && <p>Upload DPP</p>}
          {props.documentType === "dgd" && <p>Upload DGD</p>}
        </span>

        <span className="h-full p-2 text-gray-600">
          <span className="sr-only">Menu</span>
          {isActive ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </span>
      </div>

      <div className={!isActive ? "hidden" : "absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"} role="menu">
        <div className="p-5">
          <div className="text-center">
            <AiFillFileAdd className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md  font-semibold text-main-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-main-200 focus-within:ring-offset-2 hover:text-main-500"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleDocumentChange} />
              </label>
            </div>
            <p className="text-xs leading-5 text-gray-600">PDF, DOCX, PNG up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentDropdown = (props: DocumentDropdownProps) => {
  return (
    <>
      {props.isPresent ? (
        <DocumentDownload documentId={props.documentId} documentType={props.documentType} isPresent={props.isPresent} onDocumentChange={props.onDocumentChange} />
      ) : (
        <DocumentUpload documentId={props.documentId} documentType={props.documentType} isPresent={props.isPresent} onDocumentChange={props.onDocumentChange} />
      )}
    </>
  );
};

export default DocumentDropdown;
