import { useState } from "react";
import AttachmentCard from "./AttachmentCard";
import DocumentInput from "../generic/input/DocumentInput";
import { FaPlus, FaTimes } from "react-icons/fa";
import IconButton from "../generic/buttons/IconButton";

interface AttachmentsPopupProps {
  existingAttachments: string[];
  onAdd: (file: File | undefined) => void;
  onClose: () => void;
}

const AttachmentsPopup = (props: AttachmentsPopupProps) => {
  const [file, setFile] = useState<File>();
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
          <h2 className="text-xl mb-3 font-semibold">Existing Attachments</h2>
          <div className="columns-3">
            {props.existingAttachments.map((attachment, index) => (
              <div key={index} className="w-full">
                <AttachmentCard
                  attachment={{
                    attachmentTitle: attachment.split("/").pop() || "",
                    attachmentPath: attachment,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 my-5">
          <h2 className="text-xl mb-3 font-semibold">Add Attachments</h2>
          <DocumentInput onDocumentChange={onDocumentChange} />
          <div className="mt-2 flex justify-end">
            <IconButton className="bg-main-200 text-white hover:bg-white hover:text-main-200 hover:cursor-pointer" text="Add Attachment" icon={<FaPlus />} onClick={() => props.onAdd(file)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentsPopup;
