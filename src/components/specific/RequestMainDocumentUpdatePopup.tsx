import { useState } from "react";
import TextareaInputField from "../generic/input/TextareaInputField";
import IconButton from "../generic/buttons/IconButton";
import { FaSyncAlt, FaTimes } from "react-icons/fa";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import useAlert from "@/hooks/AlertHook";
import { getRequestMainDocumentUpdateText, mailUser } from "@/utils/MailingUtils";
import { ProjectState } from "@prisma/client";
import { useRouter } from "next/router";

interface RequestMainDocumentUpdatePopupProps {
  documentContractAddress: string;
  documentType: string;
  assessmentProviderInfo: { assessmentProviderName: string; assessmentProviderAddress: string };
  projectInfo: { projectManagerEmail: string; projectName: string };
  onClose: () => void;
}

const RequestMaindDocumentUpdatePopup = (props: RequestMainDocumentUpdatePopupProps) => {
  const { setConformationPopup } = useConformationPopup();
  const { setAlert } = useAlert();
  const router = useRouter();
  const [reason, setReason] = useState<string>("");

  const handleRequest = async () => {
    setConformationPopup({
      title: "Zahtevaj posodobitev",
      message: "Ali ste prepričani, da želite poslati zahtevo za posodobitev dokumenta?",
      icon: <FaSyncAlt />,
      popupType: "warning",
      buttonPrimaryText: "Pošlji",
      onClickPrimary: sendRequest,
      show: true,
    });
  };

  const sendRequest = async () => {
    try {
      const response = await fetch("/api/documentContracts/requestMainDocumentUpdate", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          documentContractAddress: props.documentContractAddress,
          signerAddress: props.assessmentProviderInfo.assessmentProviderAddress,
        }),
      });

      console.log("Hello World! :D");

      if (!response.ok) throw new Error(await response.json());

      const responseMail = await mailUser({
        to: [props.projectInfo.projectManagerEmail],
        subject: `Zahteva za posodobitev dokumenta ${props.documentType} za projekt ${props.projectInfo.projectName}`,
        text: getRequestMainDocumentUpdateText(
          props.projectInfo.projectName,
          props.documentType === "DPP" ? ProjectState.AQUIRING_PROJECT_OPINIONS : ProjectState.AQUIRING_PROJECT_CONDITIONS,
          props.assessmentProviderInfo.assessmentProviderName,
          reason
        ),
        link: router.asPath,
      });
      props.onClose();
      router.push(router.asPath);

      if (!responseMail.ok) throw new Error((await responseMail.json()).message);
    } catch (e: any) {
      setAlert({ title: "Napaka", message: e.message, type: "error" });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <span className="bg-white max-w-6xl w-1/2 rounded-lg shadow-xl bottom-52 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        <div className="mt-5 p-10">
          <h3 className="text-lg font-semibold">Vnesi razlog za posodobitev dokumenta</h3>
          <TextareaInputField title={""} instructions={""} onChange={(value) => setReason(value)} />
          <div className="flex justify-end">
            <IconButton className="bg-main-200 text-white hover:bg-white hover:text-main-200" text={"Zahtevaj Posodobitev"} icon={<FaSyncAlt />} onClick={handleRequest} />
          </div>
        </div>
      </span>
    </div>
  );
};

export default RequestMaindDocumentUpdatePopup;
