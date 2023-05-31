import { useEffect, useState } from "react";
import AttachmentCard from "./AttachmentCard";
import DocumentInput from "../generic/input/DocumentInput";
import { FaPlus, FaTimes } from "react-icons/fa";
import InputField from "../generic/input/InputField";
import IconButton from "../generic/buttons/IconButton";

interface AttachmentsPopupProps {
  opinionProviderId: number;
  onClose: () => void;
}

const AttachmentsPopup = (props: AttachmentsPopupProps) => {
  const [attachments, setAttachments] = useState<{ attachmentTitle: string; attachmentPath: string }[]>([]);

  const onDocumentChange = (document: File | null) => {};

  useEffect(() => {
    setAttachments([
      { attachmentTitle: "Priloga za statiko prvega nadstropja", attachmentPath: "public/image.png" },
      { attachmentTitle: "Priloga za celotno statiko", attachmentPath: "public/image.png" },
      { attachmentTitle: "Fotografije idejne zasnove", attachmentPath: "public/image.png" },
      { attachmentTitle: "Priloga za statiko prvega nadstropja", attachmentPath: "public/image.png" },
      { attachmentTitle: "Priloga za celotno statiko", attachmentPath: "public/image.png" },
      { attachmentTitle: "Fotografije idejne zasnove", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
      { attachmentTitle: "Idejna zasnova 12345", attachmentPath: "public/image.png" },
    ]);
  }, [props.opinionProviderId]);

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="max-w-6xl w-full rounded-2xl bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        <div className="p-5 my-5">
          <h2 className="text-xl mb-3 font-semibold">Existing Attachments</h2>
          <div className="columns-3">
            {attachments.map((attachment, index) => (
              <div className="w-full">
                <AttachmentCard attachment={attachment} />
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 my-5">
          <h2 className="text-xl mb-3 font-semibold">Add Attachments</h2>
          <InputField id="attachmentTitle" label="" placeholder="Attachment Title" type="string" />
          <DocumentInput onDocumentChange={onDocumentChange} />
          <div className="mt-2">
            <IconButton text="Add Attachment" icon={<FaPlus />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentsPopup;
