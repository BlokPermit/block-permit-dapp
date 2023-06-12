import { FaArrowUp, FaCalendarPlus, FaHourglass, FaInfo, FaPaperclip, FaQuestion, FaUpload, FaUser } from "react-icons/fa";
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
import { headers } from "next/dist/client/components/headers";
import ProjectManagerInfoPopup from "./ProjectManagerInfoPopup";

interface AssessmentProviderViewProps {
  project: ProjectModel;
  selectedState: ProjectState;
  loggedInAssessmentProvider: User;
  documentContract: DocumentContractModel;
}

const AssessmentProviderView = ({ project, selectedState, loggedInAssessmentProvider, documentContract }: AssessmentProviderViewProps) => {
  const router = useRouter();
  const { setAlert } = useAlert();
  const { setConformationPopup } = useConformationPopup();

  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState<boolean>(false);
  const [isProjectManagerInfoPopupOpen, setIsProjectManagerInfoPopupOpen] = useState<boolean>(false);
  const [unsentAttachments, setUnsentAttachments] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<File>();

  const onDocumentChange = (file: File | null) => {
    if (file) {
      setAssessment(file);
    }
  };

  const attachmentPath = `projects/${project.baseProject.id}/${project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}/${
    loggedInAssessmentProvider!.id
  }/assessment/attachments`;

  const getUnsentAttachments = async () => {
    const files = await getFileNamesFromDirectory(attachmentPath);
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
          ? "Ali ste prepričani, da želite poslati projektne pogoje?"
          : "Ali ste prepričani, da želite poslati projektno mnenje?",
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
        const assessmentUrl = `public/${assessmentPath}/${assessment.name}`;
        const attachments = unsentAttachments.map((attachment) => `public/${attachmentPath}/${attachment}`);
        const response = await fetch(`/api/documentContracts/provideAssessment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Napaka pri pošiljanju!");
        await saveDocument(assessment, assessmentPath);
        setAlert({ title: "Uspeh", message: "Pošiljanje je bilo uspešno!", type: "success" });
        router.push(router.asPath);
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
        <IconCard
          className="col-span-3"
          icon={<FaHourglass />}
          title={project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Rok za oddajo pogojev" : "Rok za oddajo mnenja"}
          value={documentContract ? formatDate(dateFromTimestamp(documentContract.assessmentDueDate)) ?? "N/A" : "N/A"}
          trailing={
            <ButtonGroup
              secondaryButtons={[
                {
                  text: "10.11.2021",
                  icon: <FaQuestion />,
                  disabled: true,
                },
              ]}
              primaryButton={{
                text: "Request Deadline Extension",
                icon: <FaCalendarPlus />,
                onClick: () => {},
              }}
            />
          }
        />
      </div>
      <h2 className="text-2xl font-semibold my-5">{project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Naloži projektne pogoje" : "Naloži projektno mnenje"}</h2>
      <DocumentInput onDocumentChange={onDocumentChange} />
      <div className="flex justify-end gap-4">
        <IconButton className="mt-3 bg-white text-main-200 hover:bg-main-200 hover:text-white" text="Priponke" icon={<FaPaperclip />} onClick={() => setIsAttachmentsPopupOpen(true)} />
        <IconButton className="mt-3 bg-main-200 text-white hover:bg-white hover:text-main-200" text="Pošlji" icon={<FaUpload />} onClick={handleSendAssessment} />
      </div>
    </div>
  );
};

export default AssessmentProviderView;
