import React, { useEffect, useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import { FaArrowUp, FaChevronDown, FaChevronUp, FaEdit, FaFileDownload, FaFileUpload, FaTimes, FaTrash } from "react-icons/fa";
import { deleteDocuments, downloadDocument, saveDocument } from "@/lib/DocumentService";
import useAlert from "@/hooks/AlertHook";
import DocumentInput from "../input/DocumentInput";
import IconButton from "../buttons/IconButton";
import { ProjectModel } from "../../../models/ProjectModel";
import { getConnectedAddress } from "../../../utils/MetamaskUtils";
import { hashFileToBytes32 } from "../../../utils/FileUtils";
import { LoadingAnimation } from "../loading-animation/LoadingAnimation";
import { useRouter } from "next/router";
import { changeDocument } from "../../../lib/DocumentService";

interface DocumentDropdownProps {
  documentId: string;
  documentType: "dpp" | "dgd";
  isPresent: boolean;
  fileName?: string;
  path: string;
  onDocumentChange: (file: File | null) => void;
  projectAddress: string;
}

const DocumentDownload = (props: DocumentDropdownProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [fileForUpdate, setFileForUpdate] = useState<File | null>(null);
  const { setAlert } = useAlert();
  const router = useRouter();

  const handleDocumentChange = (file: File | null) => {
    setFileForUpdate(file);
  };

  async function downloadFile() {
    try {
      if (props.fileName != null) {
        const file: Blob | boolean = await downloadDocument(props.fileName);
        if (!file) throw Error("Failed to download document. Please try again.");

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

  const updateDocument = async () => {
    const path = props.documentType == "dpp" ? "setDPP" : "setDGD";

    try {
      let newDocumentPath = await changeDocument(fileForUpdate!, props.fileName!);
      const response = await fetch(`/api/projects/${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectAddress: props.projectAddress,
          signerAddress: await getConnectedAddress(window),
          documentUrl: newDocumentPath,
          documentHash: await hashFileToBytes32(fileForUpdate),
        }),
      });

      if (response.ok) {
        setAlert({ title: "", message: `${props.documentType.toUpperCase()} posodobljen.`, type: "success" });
        router.push(router.asPath);
      } else {
        throw new Error(await response.json());
      }
    } catch (e: any) {
      setAlert({ title: "", message: e, type: "error" });
    }
  };

  //TODO: Add Conformation Popup and Blockchain deletion!
  const deleteDocument = async () => {
    try {
      if (props.fileName != null) {
        await deleteDocuments([props.fileName]);
        router.push(router.asPath);
      }
    } catch (e: any) {
      setAlert({ title: "Error", message: e.message, type: "error" });
    }
  };

  return (
    <div>
      <div className="inline-flex items-center overflow-hidden bg-white rounded-md border border-main-200 text-sm hover:cursor-pointer">
        <span onClick={downloadFile} className="inline-flex items-center border-e border-main-200 px-4 py-2 text-main-200 hover:bg-main-200 hover:text-white">
          <FaFileDownload className="mr-2" />
          {props.documentType === "dpp" && <p>Download DPP</p>}
          {props.documentType === "dgd" && <p>Download DGD</p>}
        </span>

        <div onClick={() => setIsActive(!isActive)} className="p-2 bg-white text-main-200">
          <div>{isActive ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>
      </div>
      <div className={!isActive ? "hidden" : "absolute z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border bg-white border-gray-100 shadow-lg"} role="menu">
        {isUpdate ? (
          <span>
            <div
              className="absolute top-2 right-2 hover:cursor-pointer hover:text-gray-500"
              onClick={() => {
                setIsUpdate(false);
                setFileForUpdate(null);
              }}
            >
              <FaTimes />
            </div>
            <DocumentInput onDocumentChange={handleDocumentChange} />
            {fileForUpdate && (
              <div className="p-3 flex justify-end">
                <IconButton className="bg-main-200 text-white hover:bg-white hover:text-main-200" text={"Update"} icon={<FaEdit />} onClick={updateDocument} />
              </div>
            )}
          </span>
        ) : (
          <>
            <div className="p-2">
              <strong className="block p-2 text-xs font-medium uppercase text-gray-400">General</strong>

              <button onClick={downloadFile} className="w-full text-left block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700" role="menuitem">
                Download
              </button>

              <button
                onClick={() => {
                  setIsUpdate(true);
                }}
                className="w-full text-left block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                Update
              </button>
            </div>

            <div className="p-2">
              <strong className="block p-2 text-xs font-medium uppercase text-gray-400">Danger Zone</strong>

              <button onClick={deleteDocument} className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50" role="menuitem">
                <FaTrash />
                Delete
              </button>
            </div>
          </>
        )}
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

  const uploadDocument = async () => {
    try {
      if (file) {
        const documentUrl = await saveDocument(file, props.path);

        const body = {
          projectAddress: props.projectAddress,
          signerAddress: await getConnectedAddress(window),
          documentUrl: documentUrl,
          documentHash: await hashFileToBytes32(file),
        };

        const path = props.documentType == "dpp" ? "setDPP" : "setDGD";

        const response = await fetch(`/api/projects/${path}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          setIsActive(false);
          setAlert({ title: "Success", message: "DPP is set", type: "success" });
          props.onDocumentChange(file);
        } else {
          throw new Error((await response.json()).message);
        }
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
        <DocumentDownload
          documentId={props.documentId}
          documentType={props.documentType}
          isPresent={props.isPresent}
          fileName={props.fileName}
          onDocumentChange={props.onDocumentChange}
          path={props.path}
          projectAddress={props.projectAddress}
        />
      ) : (
        <DocumentUpload
          documentId={props.documentId}
          documentType={props.documentType}
          isPresent={props.isPresent}
          onDocumentChange={props.onDocumentChange}
          path={props.path}
          projectAddress={props.projectAddress}
        />
      )}
    </>
  );
};

export default DocumentDropdown;
