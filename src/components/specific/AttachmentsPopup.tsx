import React, { useState } from "react";
import AttachmentCard from "./AttachmentCard";
import DocumentInput from "../generic/input/DocumentInput";
import { FaPlus, FaTimes } from "react-icons/fa";
import IconButton from "../generic/buttons/IconButton";
import useAlert from "@/hooks/AlertHook";

//TODO: pass prop to identify if user is PM or AP
interface AttachmentsPopupProps {
  existingAttachments: string[];
  onAdd: (file: File | undefined) => void;
  onClose: () => void;
  documentContractAddress: string;
  addDisabeld?: boolean;
}

const AttachmentsPopup = (props: AttachmentsPopupProps) => {
  const [file, setFile] = useState<File>();
  const { setAlert } = useAlert();
  const onDocumentChange = (file: File | null) => {
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        <div className="p-5 my-5">
          <h2 className="text-xl mb-3 font-semibold">Priloge</h2>
          {props.existingAttachments.length === 0 && <div className="text-gray-500">Ni prilog</div>}
          <div>
            {props.existingAttachments.map((attachment, index) => (
              <div key={index} className="w-full">
                <AttachmentCard
                  onRemove={(attachmentPath: string) => {
                    props.existingAttachments.splice(props.existingAttachments.indexOf(attachmentPath), 1);
                    setAlert({ title: "Priponka odstranjena", message: "Priloga je bila uspešno odstranjena", type: "success" });
                  }}
                  attachment={{
                    attachmentTitle: attachment.split("/").pop() || "",
                    attachmentPath: attachment,
                  }}
                  documentContractAddress={props.documentContractAddress ?? null}
                  removeDisabled={props.addDisabeld}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 my-5">
          {!props.addDisabeld && (
            <>
              <h2 className="text-xl mb-3 font-semibold">Dodaj priponko</h2>
              <DocumentInput onDocumentChange={onDocumentChange} />
              <div className="mt-2 flex justify-end">
                <IconButton
                  className="bg-main-200 text-white hover:bg-white hover:text-main-200 hover:cursor-pointer"
                  text="Dodaj prilogo"
                  icon={<FaPlus />}
                  onClick={() => {
                    props.onAdd(file);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsPopup;
