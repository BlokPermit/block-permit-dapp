import { FaArrowUp, FaBell, FaCheck, FaClock, FaEye, FaInfo, FaPaperclip, FaSpinner, FaTimes } from "react-icons/all";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import React, { useEffect, useState } from "react";
import IconBadge from "../generic/data-view/IconBadge";
import { ProjectState, User } from "@prisma/client";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import AttachmentsPopup from "./AttachmentsPopup";
import { saveDocument } from "@/lib/DocumentService";
import { useRouter } from "next/router";
import { getFileNamesFromDirectory } from "../../lib/DocumentService";
import { getConnectedAddress } from "../../utils/MetamaskUtils";
import { hashFileToBytes32 } from "../../utils/FileUtils";
import useAlert from "../../hooks/AlertHook";
import AssessmentProviderInfoPopup from "@/components/specific/AssessmentProviderInfoPopup";
import { FaFileDownload } from "react-icons/fa";

interface AssessmentProviderListItemProps {
  assessmentProvider: User;
  projectId: string;
  actualProjectState: ProjectState;
  selectedProjectState: ProjectState;
  documentContract: DocumentContractModel | undefined;
  isMainDocumentPresent: boolean;
  countSelected: (isSelected: boolean, id: string) => void;
  projectManagerAddress?: string;
  projectAddress: string;
  projectName: string;
  downloadAssessment: (paths: string[], zipName: string) => Promise<boolean>;
}

const AssessmentProviderListItem = (props: AssessmentProviderListItemProps) => {
  const router = useRouter();
  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState<boolean>(false);
  const [isAssessmentProviderInfoPopupOpen, setIsAssessmentProviderInfoPopupOpen] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [unsentAttachments, setUnsentAttachments] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { setAlert } = useAlert();

  const getUnsentAttachments = async () => {
    const files = await getFileNamesFromDirectory(
      `public/projects/${props.projectId}/${props.actualProjectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${props.assessmentProvider.id}/attachments`
    );
    setUnsentAttachments(files);
  };

  const handleAddAttachment = async (file: File | undefined) => {
    if (file) {
      const path = `projects/${props.projectId}/${props.actualProjectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${props.assessmentProvider.id}/attachments`;
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

          const response = await fetch(`/api/documentContracts/addAttachments`, {
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
      } catch (e: any) {
        setAlert({ title: "Napaka", message: e.message, type: "error" });
      }
    }
  };

  useEffect(() => {
    getUnsentAttachments();
  }, []);

  const downloadAssessment = async () => {
    setIsDownloading(true);
    let paths: string[] = props.documentContract!.assessmentAttachments ?? [];
    const zipName = `${props.projectName}_${props.actualProjectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektni-pogoji" : "projektno-mnenje"}_${props.assessmentProvider.name}`;
    paths.push(props.documentContract!.assessmentMainDocument!);
    setIsDownloading(await props.downloadAssessment(paths, zipName));
  };

  return (
    <>
      {isAttachmentsPopupOpen && (
        <AttachmentsPopup
          existingAttachments={props.documentContract ? props.documentContract.attachments ?? [] : unsentAttachments}
          onAdd={handleAddAttachment}
          onClose={() => setIsAttachmentsPopupOpen(false)}
          documentContractAddress={props.documentContract ? props.documentContract.documentContractAddress! : ""}
          addDisabeld={props.documentContract ? props.documentContract.isClosed : false}
        />
      )}
      {isAssessmentProviderInfoPopupOpen && (
        <AssessmentProviderInfoPopup
          projectAddress={props.projectAddress}
          assessmentProvider={props.assessmentProvider}
          documentContract={props.documentContract}
          onClose={() => setIsAssessmentProviderInfoPopupOpen(false)}
          projectName={props.projectName}
        />
      )}
      <div key={props.assessmentProvider.id} className={`${isSelected ? "p-4 mb-4 rounded-lg bg-gray-100 border border-gray-200" : "p-4 mb-4 rounded-lg bg-white border border-gray-200"}`}>
        <div className="flex justify-between">
          <div className="flex justify-between gap-5 items-center">
            <div className="text-lg">
              {!props.documentContract && <IconBadge icon={<FaArrowUp />} text="Waiting to Send" badgeType="info" />}
              {props.documentContract && !props.documentContract.isClosed && <IconBadge icon={<FaClock />} text="Waiting for Assessment" badgeType="warning" />}
              {props.documentContract && props.documentContract.isClosed && <IconBadge icon={<FaCheck />} text="Ready for Review" badgeType="success" />}
            </div>
            <span className="text-black">
              <div className="text-lg font-bold">{props.assessmentProvider.name}</div>
            </span>
          </div>
          {props.isMainDocumentPresent ? (
            <span className="inline-flex items-center gap-3">
              {props.documentContract && (props.documentContract.mainDocumentUpdateRequested || props.documentContract.requestedAssessmentDueDate) && <FaBell color="red" />}
              <ButtonGroup
                secondaryButtons={[
                  {
                    text: "More info",
                    icon: <FaInfo />,
                    onClick: () => setIsAssessmentProviderInfoPopupOpen(true),
                  },
                  {
                    text: "Attachments",
                    icon: <FaPaperclip />,
                    onClick: () => setIsAttachmentsPopupOpen(true),
                  },
                ]}
                primaryButton={
                  !props.documentContract
                    ? {
                        text: isSelected ? "Deselect" : "Select",
                        icon: isSelected ? <FaTimes /> : <FaCheck />,
                        onClick: () => {
                          setIsSelected(!isSelected);
                          props.countSelected(!isSelected, props.assessmentProvider.id);
                        },
                      }
                    : {
                        text:
                          props.documentContract && props.documentContract.isClosed
                            ? `Prenesi ${props.actualProjectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektne pogoje" : "projektno mnenje"}`
                            : "Sent",
                        icon: props.documentContract && props.documentContract.isClosed ? !isDownloading ? <FaFileDownload /> : <FaSpinner className="animate-spin" /> : <FaArrowUp />,
                        onClick: props.documentContract && props.documentContract.isClosed ? downloadAssessment : () => {},
                        disabled: props.documentContract && props.documentContract.isClosed ? false : true,
                      }
                }
              />
            </span>
          ) : (
            <ButtonGroup
              secondaryButtons={[]}
              primaryButton={{
                text: "More info",
                icon: <FaInfo />,
                onClick: () => setIsAssessmentProviderInfoPopupOpen(true),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AssessmentProviderListItem;
