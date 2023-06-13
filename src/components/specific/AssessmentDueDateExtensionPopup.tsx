import Calendar from "react-calendar";
import IconButton from "../generic/buttons/IconButton";
import { useState } from "react";
import TextareaInputField from "../generic/input/TextareaInputField";
import { DocumentContractModel, MainDocumentType } from "../../models/DocumentContractModel";
import { FaArrowUp, FaTimes } from "react-icons/fa";
import useConformationPopup from "../../hooks/ConformationPopupHook";
import { dateFromTimestamp, formatDate } from "../../utils/DateUtils";
import useAlert from "../../hooks/AlertHook";
import { useRouter } from "next/router";
import { getConnectedAddress } from "../../utils/MetamaskUtils";
import { ProjectState } from "@prisma/client";
import { getRequestMainDocumentUpdateText, mailUser } from "../../utils/MailingUtils";

interface AssessmentProviderDueDateExtensionPopupProps {
  onClose: () => void;
  documentContract: DocumentContractModel;
  projectInfo: { name: string; projectManagerEmail: string };
}

const AssessmentProviderInfoPopup = (props: AssessmentProviderDueDateExtensionPopupProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(dateFromTimestamp(props.documentContract.assessmentDueDate));
  const [reason, setReason] = useState<string>("");
  const { setConformationPopup } = useConformationPopup();
  const { setAlert } = useAlert();
  const router = useRouter();

  const maxDate = new Date(dateFromTimestamp(props.documentContract.dateCreated));
  maxDate.setDate(maxDate.getDate() + 59);

  const handleRequestDueDateExtension = async () => {
    setConformationPopup({
      title: "Pošlji prošnjo",
      message: `Ali ste prepričani, da želite poslati prošnjo za podaljšanje datuma oddaje 
            ${props.documentContract.mainDocumentType == MainDocumentType.DPP ? "projektnih pogojev" : "projektnega mnenja"} 
            do ${formatDate(selectedDate)}`,
      icon: <FaArrowUp />,
      popupType: "warning",
      buttonPrimaryText: "Pošlji",
      onClickPrimary: requestDueDateExtension,
      show: true,
    });
  };

  const requestDueDateExtension = async () => {
    try {
      const response = await fetch(`/api/documentContracts/requestAssessmentDueDateExtension`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signerAddress: await getConnectedAddress(window),
          documentContractAddres: props.documentContract.documentContractAddress,
          requestedDueDate: selectedDate,
        }),
      });

      if (response.ok) {
        const responseMail = await mailUser({
          to: [props.projectInfo.projectManagerEmail],
          subject: `${props.projectInfo.name} - pridobljena zahteva za podaljšanje roka oddaje ${
            props.documentContract.mainDocumentType == MainDocumentType.DPP ? "projektnih pogojev" : "projektnega mnenja"
          }`,
          text: getRequestMainDocumentUpdateText(
            props.projectInfo.name,
            props.documentContract.mainDocumentType == MainDocumentType.DPP ? ProjectState.AQUIRING_PROJECT_CONDITIONS : ProjectState.AQUIRING_PROJECT_OPINIONS,
            props.documentContract.assessmentProvider.name,
            reason
          ),
          link: router.asPath,
        });
        if (!responseMail.ok) throw new Error(await responseMail.json());
      } else {
        throw new Error(await response.json());
      }
      router.push(router.asPath);
    } catch (e: any) {
      setAlert({ title: "", message: e.message, type: "error" });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute top-5 right-5">
          <FaTimes className="hover:text-gray-500 hover:cursor-pointer" size={20} onClick={props.onClose} />
        </div>
        <div className="my-calendar mt-5">
          <Calendar
            locale={"sl-SL"}
            value={selectedDate}
            onChange={(value) => setSelectedDate(value as Date)}
            minDate={dateFromTimestamp(props.documentContract.assessmentDueDate)}
            maxDate={maxDate}
          />
        </div>
        <TextareaInputField onChange={(value) => setReason(value)} instructions={"Vnesite razlog za zahtevo o podaljšanju roka ocenitve."} title={""} />
        <div className="flex justify-end">
          <IconButton className="bg-main-200 text-white hover:bg-white hover:text-main-200" text="Izberi datum" icon={null} onClick={handleRequestDueDateExtension} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentProviderInfoPopup;
