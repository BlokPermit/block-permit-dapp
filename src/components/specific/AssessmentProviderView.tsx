import { FaArrowUp, FaCalendarPlus, FaFileDownload, FaHourglass, FaPaperclip, FaQuestion, FaUpload, FaUser, FaInfo } from "react-icons/fa";
import IconCard from "../generic/data-view/IconCard";
import { ProjectModel } from "@/models/ProjectModel";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import { ProjectState, User } from "@prisma/client";
import { dateFromTimestamp, formatDate } from "@/utils/DateUtils";
import ButtonGroup from "../generic/buttons/ButtonGroup";
import IconButton from "../generic/buttons/IconButton";
import DocumentInput from "../generic/input/DocumentInput";
import { useEffect, useState } from "react";
import AttachmentsPopup from "./AttachmentsPopup";
import { getFileNamesFromDirectory, saveDocument } from "@/lib/DocumentService";
import useAlert from "@/hooks/AlertHook";
import { useRouter } from "next/router";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import { getConnectedAddress } from "../../utils/MetamaskUtils";
import { hashFileToBytes32 } from "../../utils/FileUtils";
import { getFileNamesWithHashesFromDirectory } from "../../lib/DocumentService";
import { FaSpinner } from "react-icons/all";
import "react-calendar/dist/Calendar.css";
import AssessmentDueDateExtensionPopup from "./AssessmentDueDateExtensionPopup";
import ProjectManagerInfoPopup from "./ProjectManagerInfoPopup";

interface AssessmentProviderViewProps {
  project: ProjectModel;
  selectedState: ProjectState;
  loggedInAssessmentProvider: User;
  documentContract: DocumentContractModel;
  downloadZip: (paths: string[], zipName: string) => Promise<boolean>;
}

const AssessmentProviderView = ({ project, selectedState, loggedInAssessmentProvider, documentContract, downloadZip }: AssessmentProviderViewProps) => {
  const router = useRouter();
  const { setAlert } = useAlert();
  const { setConformationPopup } = useConformationPopup();

  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState<boolean>(false);
  const [isProjectManagerInfoPopupOpen, setIsProjectManagerInfoPopupOpen] = useState<boolean>(false);
  const [unsentAttachments, setUnsentAttachments] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<File>();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isAssessmentDueDateExtensionPopupOpen, setIsAssessmentDueDateExtensionPopupOpen] = useState<boolean>(false);

  const onDocumentChange = (file: File | null) => {
    if (file) {
      setAssessment(file);
    }
  };

  const attachmentPath = `projects/${project.baseProject.id}/${project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${
    loggedInAssessmentProvider!.id
  }/assessment/attachments`;

  const getUnsentAttachments = async () => {
    const files = await getFileNamesFromDirectory(`public/${attachmentPath}`);
    setUnsentAttachments(files);
  };

  const handleAddAttachment = async (file: File | undefined) => {
    if (file) {
      try {
        await saveDocument(file, attachmentPath);
        setUnsentAttachments([...unsentAttachments, `${attachmentPath}/${file.name}`]);
        setAlert({ title: "", message: `Priloga ${file.name} naložena`, type: "success" });
        router.push(router.asPath);
        setIsAttachmentsPopupOpen(false);
      } catch (e: any) {
        setAlert({ title: "Napaka", message: e.message, type: "error" });
      }
    } else {
      setAlert({ title: "Opozorilo", message: "Najprej naložite datoteko!", type: "warning" });
    }
  };

  const assessmentPath = `projects/${project.baseProject.id}/${project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${
    loggedInAssessmentProvider!.id
  }/assessment`;

  const handleSendAssessment = async () => {
    setConformationPopup({
      title: project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Pošlji projektne pogoje" : "Pošlji projektno mnenje",
      message:
        project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS
          ? "Ali ste prepričani, da želite poslati projektne pogoje? Kasnejše spreminjanje in dodajanje prilog več ne bo mogoče."
          : "Ali ste prepričani, da želite poslati projektno mnenje? Kasnejše spreminjanje in dodajanje prilog več ne bo mogoče.",
      icon: <FaArrowUp />,
      popupType: "warning",
      buttonPrimaryText: "Pošlji",
      onClickPrimary: sendAssessment,
      show: true,
    });
  };

  //TODO: Fill fetch with correct data
  const sendAssessment = async () => {
    if (assessment) {
      try {
        const connectedAddress = await getConnectedAddress(window);
        const assessmentUrl = `public/${assessmentPath}/${assessment.name}`;
        const assessmentMainDocument = {
          id: assessmentUrl,
          owner: connectedAddress,
          documentHash: await hashFileToBytes32(assessment),
        };

        const assessmentAttachments = await getFileNamesWithHashesFromDirectory(`public/${assessmentPath}/attachments`);
        for (let attachment of assessmentAttachments) {
          attachment.owner = connectedAddress;
        }

        const assessmentStruct = {
          assessmentMainDocument: assessmentMainDocument,
          assessmentAttachments: assessmentAttachments,
        };
        const response = await fetch(`/api/documentContracts/provideAssessment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessment: assessmentStruct,
            signerAddress: connectedAddress,
            documentContractAddres: documentContract.documentContractAddress,
          }),
        });

        if (!response.ok) throw new Error((await response.json()).message);
        await saveDocument(assessment, assessmentPath);
        setAlert({ title: "Uspeh", message: "Pošiljanje je bilo uspešno!", type: "success" });
        router.reload();
      } catch (e: any) {
        setAlert({ title: "Napaka", message: e.message, type: "error" });
      }
    } else {
      setAlert({ title: "Opozorilo", message: "Najprej naložite datoteko!", type: "warning" });
    }
  };

  useEffect(() => {
    getUnsentAttachments();
  }, []);

  const downloadAssessment = async () => {
    setIsDownloading(true);
    let paths: string[] = documentContract!.assessmentAttachments ?? [];
    const zipName = `${project.baseProject.name}_${selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektni-pogoji" : "projektno-mnenje"}_${loggedInAssessmentProvider.name}`;
    paths.push(documentContract!.assessmentMainDocument!);
    setIsDownloading(await downloadZip(paths, zipName));
  };

  return (
    <div className="mb-10">
      <div className="grid grid-cols-5 gap-5 mb-10">
        {isAttachmentsPopupOpen && (
          <AttachmentsPopup
            existingAttachments={unsentAttachments ?? []}
            onAdd={handleAddAttachment}
            onClose={() => setIsAttachmentsPopupOpen(false)}
            documentContractAddress={documentContract ? documentContract.documentContractAddress ?? "" : ""}
          />
        )}
        {isProjectManagerInfoPopupOpen && <ProjectManagerInfoPopup projectManager={project.projectManager} onClose={() => setIsProjectManagerInfoPopupOpen(false)} />}
        <IconCard
          className="col-span-2"
          icon={<FaUser />}
          title="Projektni vodja"
          value={project.projectManager.name}
          trailing={
            <ButtonGroup
              secondaryButtons={[
                {
                  text: "Več informacij",
                  icon: <FaInfo />,
                  onClick: () => setIsProjectManagerInfoPopupOpen(true),
                },
              ]}
            />
          }
        />
        {isAssessmentDueDateExtensionPopupOpen && (
          <AssessmentDueDateExtensionPopup
            onClose={() => setIsAssessmentDueDateExtensionPopupOpen(false)}
            projectInfo={{ name: project.baseProject.name, projectManagerEmail: project.projectManager.email }}
            documentContract={documentContract}
          />
        )}
        <IconCard
          className="col-span-3"
          icon={<FaHourglass />}
          title={selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Rok za oddajo pogojev" : "Rok za oddajo mnenja"}
          value={documentContract ? formatDate(dateFromTimestamp(documentContract.assessmentDueDate)) ?? "N/A" : "N/A"}
          valueClassName={
            documentContract
              ? documentContract.assessmentDateProvided
                ? documentContract.assessmentDateProvided < documentContract.assessmentDueDate
                  ? "text-green-500"
                  : "text-red-500"
                : dateFromTimestamp(documentContract.assessmentDueDate) > new Date()
                ? "text-main-200"
                : "text-red-500"
              : undefined
          }
          trailing={
            documentContract ? (
              !documentContract.isClosed ? (
                <ButtonGroup
                  secondaryButtons={
                    documentContract.requestedAssessmentDueDate
                      ? [
                          {
                            text: formatDate(dateFromTimestamp(documentContract.requestedAssessmentDueDate)),
                            icon: <FaQuestion />,
                            disabled: true,
                          },
                        ]
                      : []
                  }
                  primaryButton={
                    !documentContract.requestedAssessmentDueDate
                      ? {
                          text: "Zaprosi za podaljšanje roka ocenitve",
                          icon: <FaCalendarPlus />,
                          onClick: () => setIsAssessmentDueDateExtensionPopupOpen(true),
                        }
                      : {
                          text: "Zaprosi za podaljšanje roka ocenitve",
                          icon: <FaCalendarPlus />,
                          onClick: () => {},
                          disabled: true,
                        }
                  }
                />
              ) : (
                <ButtonGroup
                  secondaryButtons={[]}
                  primaryButton={{
                    text: selectedState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Prenesi projektne pogoje" : "Prenesi projektno mnenje",
                    icon: !isDownloading ? <FaFileDownload /> : <FaSpinner className="animate-spin" />,
                    onClick: downloadAssessment,
                  }}
                />
              )
            ) : null
          }
        />
      </div>
      {documentContract && !documentContract.isClosed ? (
        <div>
          <h2 className="text-2xl font-semibold my-5">{project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Naloži projektne pogoje" : "Naloži projektno mnenje"}</h2>
          <DocumentInput onDocumentChange={onDocumentChange} />
          <div className="flex justify-end gap-4">
            <IconButton className="mt-3 bg-white text-main-200 hover:bg-main-200 hover:text-white" text="Priloge" icon={<FaPaperclip />} onClick={() => setIsAttachmentsPopupOpen(true)} />
            {assessment ? <IconButton className="mt-3 bg-main-200 text-white hover:bg-white hover:text-main-200" text="Pošlji" icon={<FaUpload />} onClick={handleSendAssessment} /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AssessmentProviderView;
