import useAlert from "@/hooks/AlertHook";
import { downloadDocument } from "@/lib/DocumentService";
import { useState } from "react";
import { FaArrowDown, FaPaperclip, FaRegTrashAlt, FaTrash, FaTrashAlt, FaTrashRestore } from "react-icons/fa";

interface AttachmentCardProps {
  attachment: { attachmentTitle: string; attachmentPath: string };
}

const AttachmentCard = (props: AttachmentCardProps) => {
  const { setAlert } = useAlert();
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const downloadAttachment = async () => {
    try {
      if (props.attachment.attachmentPath != null) {
        const file: Blob | boolean = await downloadDocument(props.attachment.attachmentPath);
        if (file == false) throw Error("Failed to download document. Please try again.");

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
  const removeAttachment = () => {};

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
