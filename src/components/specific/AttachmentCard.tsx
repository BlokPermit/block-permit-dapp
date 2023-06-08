import useAlert from "@/hooks/AlertHook";
import { deleteDocuments, downloadDocument } from "@/lib/DocumentService";
import { useState } from "react";
import { FaArrowDown, FaPaperclip, FaRegTrashAlt, FaTrash, FaTrashAlt, FaTrashRestore } from "react-icons/fa";
import {getConnectedAddress} from "../../utils/MetamaskUtils";

interface AttachmentCardProps {
  attachment: { attachmentTitle: string; attachmentPath: string };
  onRemove: (attachmentPath: string) => void;
  documentContractAddress: string;
}

const AttachmentCard = (props: AttachmentCardProps) => {
  const { setAlert } = useAlert();
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const downloadAttachment = async () => {
    try {
      if (props.attachment.attachmentPath != null) {
        const file: Blob | boolean = await downloadDocument(props.attachment.attachmentPath);
        if (!file) throw Error("Failed to download document. Please try again.");

        const blobURL = window.URL.createObjectURL(file as Blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.setAttribute("download", props.attachment.attachmentTitle);
        downloadLink.click();
      }
    } catch (error: Error | any) {
      setAlert({ title: "", message: error.message, type: "error" });
    }
  };
  const removeAttachment = async () => {
    try {
      if (props.attachment.attachmentPath != null) {
        await deleteDocuments([props.attachment.attachmentPath]);
        //TODO: make path dynamic for AP - should be calling api/project/assessment/removeAttachments
        const response = await fetch(`/api/projects/removeAttachments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attachmentIds: [props.attachment.attachmentPath],
            documentContractAddress: props.documentContractAddress,
            signerAddress: await getConnectedAddress(window),
          }),
        });

        if (response.ok) {
          setAlert({ title: "", message: `Priloga ${props.attachment.attachmentPath} izbrisana`, type: "success" });
          props.onRemove(props.attachment.attachmentPath);
        } else {
          throw new Error(await response.json());
        }
      }
    } catch (e: any) {
      setAlert({ title: "Napaka", message: e.message, type: "error" });
    }
  };

  return (
    <div className={`flex justify-between items-center rounded-lg bg-white border-2 mb-4 ${isDownloadHovered ? "border-main-200" : "border-gray-200"}`}>
      <div
        onClick={downloadAttachment}
        className="inline-flex items-center gap-2 p-3 hover:border-main-200 hover:cursor-pointer hover:text-main-200"
        onMouseEnter={() => setIsDownloadHovered(true)}
        onMouseLeave={() => setIsDownloadHovered(false)}
      >
        {isDownloadHovered ? <FaArrowDown /> : <FaPaperclip />}
        <p>{props.attachment.attachmentTitle}</p>
      </div>
      <div className="border-s p-3 hover:cursor-pointer hover:text-red-500" onClick={removeAttachment}>
        <FaTrash />
      </div>
    </div>
  );
};

export default AttachmentCard;
