import {
  FaArrowUp,
  FaCalendar,
  FaCalendarCheck,
  FaCalendarMinus, FaCalendarPlus,
  FaCheck,
  FaClock,
  FaEye,
  FaPaperclip,
  FaTimes
} from "react-icons/all";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import React, {useEffect, useState} from "react";
import IconBadge from "../generic/data-view/IconBadge";
import {User} from "@prisma/client";
import {DocumentContractModel} from "@/models/DocumentContractModel";
import {dateFromTimestamp, formatDate} from "../../utils/DateUtils";
import AttachmentsPopup from "./AttachmentsPopup";
import {saveDocument} from "@/lib/DocumentService";
import {useRouter} from "next/router";
import {getFileNamesFromDirectory} from "../../lib/DocumentService";
import {getConnectedAddress} from "../../utils/MetamaskUtils";
import {hashFileToBytes32} from "../../utils/FileUtils";
import useAlert from "../../hooks/AlertHook";
import IconButton from "../generic/buttons/IconButton";

interface AssessmentProviderListItemProps {
  assessmentProvider: User;
  projectId: string;
  projectState: ProjectState;
  documentContract: DocumentContractModel;
  isMainDocumentPresent: boolean;
  countSelected: (isSelected: boolean, id: string) => void;
  projectManagerAddress?: string;
}

const AssessmentProviderListItem = (props: AssessmentProviderListItemProps) => {
  const router = useRouter();
  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [status, setStatus] = useState<"waiting to send" | "sent" | "assessed">("assessed");
  const [unsentAttachments, setUnsentAttachments] = useState<string[]>([]);
  const { setAlert } = useAlert();

  const getUnsentAttachments = async () => {
    const files = await getFileNamesFromDirectory(
      `public/projects/${props.projectId}/${props.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${props.assessmentProvider.id}/attachments`
    );
    if (typeof files !== "boolean") {
      setUnsentAttachments(files);
    }
  };

  const handleAddAttachment = async (file: File | undefined) => {
    if (file) {
      const path = `projects/${props.projectId}/${props.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${props.assessmentProvider.id}/attachments`;
      try {
        await saveDocument(file, path);
        setUnsentAttachments([...unsentAttachments, `${path}/${file.name}`]);
        //TODO: store multiple to blockchain if we add multiinput
        const projectManagerAddress: string = await getConnectedAddress(window);
        if (props.documentContract) {
          const attachmentDocumentStruct = [
            {
              id: `${path}/${file.name}`,
              owner: await getConnectedAddress(window),
              documentHash: await hashFileToBytes32(file),
            },
          ];

          const response = await fetch(`/api/projects/addAttachments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              attachments: attachmentDocumentStruct,
              documentContractAddress: props.documentContract.documentContractAddress,
              signerAddress: projectManagerAddress,
            }),
          });

          if (response.ok) {
            setAlert({ title: "", message: `Priloga ${file.name} naložena`, type: "success" });
            router.push(router.asPath);
          } else {
            throw new Error(await response.json());
          }
        }
        setIsAttachmentsPopupOpen(false);
      } catch (error: any) {
        setAlert({ title: "", message: error, type: "error" });
      }
    }
  };

  const handleRequestedDueDateExtensionEvaluation = async (confirmed: boolean) => {
    const response = await fetch(`/api/documentContracts/evaluateAssessmentDueDateExtension`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentContractAddress: props.documentContract.documentContractAddress,
        signerAddress: await getConnectedAddress(window),
        confirmed: confirmed
      }),
    });

    if (response.ok) {
      setAlert({ title: "", message: `Rok za ocenitev ${confirmed ? "sprejet" : "zavrnjen"}`, type: "success" });
      router.push(router.asPath);
    } else {
      setAlert({ title: "", message: (await response.json()).message, type: "error" });
    }
  }

  useEffect(() => {
    if (props.documentContract) {
      setStatus("sent");
      if (props.documentContract.isClosed) {
        setStatus("assessed");
        return;
      }
      return;
    }
    setStatus("waiting to send");
    getUnsentAttachments();
  }, []);

  return (
    <>
      {isAttachmentsPopupOpen && (
        <AttachmentsPopup
          existingAttachments={props.documentContract ? props.documentContract.attachments ?? [] : unsentAttachments}
          onAdd={handleAddAttachment}
          onClose={() => setIsAttachmentsPopupOpen(false)}
          documentContractAddress={props.documentContract.documentContractAddress}
        />
      )}
      <div key={props.assessmentProvider.id} className={isSelected ? "p-4 mb-4 rounded-lg bg-gray-100 border border-gray-200" : "p-4 mb-4 rounded-lg bg-white border border-gray-200"}>
        <div className="flex justify-between">
          <div className="flex justify-between gap-5 items-center">
            <div className="text-lg">
              {status === "waiting to send" && <IconBadge icon={<FaArrowUp />} text="Waiting to Send" badgeType="info" />}
              {status === "sent" && <IconBadge icon={<FaClock />} text="Waiting for Assessment" badgeType="warning" />}
              {status === "assessed" && <IconBadge icon={<FaCheck />} text="Ready for Review" badgeType="success" />}
            </div>
            <span className="text-black">
              <div className="text-lg font-bold">{props.assessmentProvider.name}</div>
            </span>
          </div>
          {props.isMainDocumentPresent && (
            <ButtonGroup
              secondaryButtons={
                status === "sent"
                  ? [
                      {
                        text: formatDate(dateFromTimestamp(props.documentContract.assessmentDueDate!)),
                        icon: <FaCalendar />,
                        onClick: () => {},
                        disabled: true,
                      },
                      {
                        text: "Attachments",
                        icon: <FaPaperclip />,
                        onClick: () => setIsAttachmentsPopupOpen(true),
                      },
                    ]
                  : [
                      {
                        text: "Attachments",
                        icon: <FaPaperclip />,
                        onClick: () => setIsAttachmentsPopupOpen(true),
                      },
                    ]
              }
              primaryButton={
                status === "waiting to send"
                  ? {
                      text: isSelected ? "Deselect" : "Select",
                      icon: isSelected ? <FaTimes /> : <FaCheck />,
                      onClick: () => {
                        setIsSelected(!isSelected);
                        props.countSelected(!isSelected, props.assessmentProvider.id);
                      },
                    }
                  : {
                      text: status === "assessed" ? "Review" : "Sent",
                      icon: status === "assessed" ? <FaEye /> : <FaArrowUp />,
                      onClick: status === "assessed" ? () => {} : () => {},
                      disabled: status === "assessed" ? false : true,
                    }
              }
            />
          )}
        </div>
        {/*TODO: move*/}
        {props.documentContract.requestedAssessmentDueDate && (
        <div>
          <IconButton text={"Potrdi podaljšanje roka"} icon={<FaCalendarPlus/>} onClick={() => handleRequestedDueDateExtensionEvaluation(true)} className="bg-green-800"/>
          <IconButton text={"Zavrni podaljšanje roka"} icon={<FaCalendarMinus/>} onClick={() => handleRequestedDueDateExtensionEvaluation(false)} className="bg-red-800"/>
        </div>)}
      </div>
    </>
  );
};

export default AssessmentProviderListItem;
