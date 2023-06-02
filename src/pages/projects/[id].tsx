import { useRouter } from "next/router";
import { findProjectById } from "@/lib/ProjectService";
import { Investor, Project } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import { FaArrowUp, FaBookmark, FaCalendarPlus, FaFileContract, FaHeading, FaHourglass, FaPaperclip, FaQuestion, FaTag, FaTrash, FaUpload, FaUser } from "react-icons/all";
import IconButton from "@/components/generic/buttons/IconButton";
import DocumentDropdown from "@/components/generic/dropdown/DocumentDropdown";
import IconCard from "@/components/generic/data-view/IconCard";
import InvestorsTable from "@/components/specific/InvestorsTable";
import OpinionProvider from "@/components/specific/OpinionProvider";
import AttachmentsPopup from "@/components/specific/AttachmentsPopup";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import ProgressBar from "@/components/specific/ProgressBar";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import AttachmentCard from "@/components/specific/AttachmentCard";
import DocumentInput from "@/components/generic/input/DocumentInput";
import InputField from "@/components/generic/input/InputField";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";

export const getServerSideProps: GetServerSideProps<{ foundProject: Project | null }> = async () => {
  //TODO: dynamic id
  const project: Project | null = await findProjectById("6479cff69ae59a148d3d603f");
  return { props: { foundProject: project } };
};

const ProjectPage = ({ foundProject }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { setConformationPopup } = useConformationPopup();
  const [project, setProject] = useState<Project | null>(null);

  const [isDPPPresent, setIsDPPPresent] = useState<boolean>(true);
  const onDocumentChange = (file: File | null) => {};

  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState<boolean>(false);

  const handleSend = () => {
    setConformationPopup({
      title: "Send to Opinion Providers",
      message: "Are you sure you want to send this project to the selected opinion providers?",
      icon: <FaArrowUp />,
      popupType: "warning",
      buttonPrimaryText: "Send",
      onClickPrimary: () => {
        console.log("Send to opinion providers");
      },
      show: true,
    });
  };

  const handleRemove = () => {
    setConformationPopup({
      title: "Delete Opinion Providers",
      message: "Are you sure you want to delete this Opinion Provider? This action cannot be undone!",
      icon: <FaTrash />,
      popupType: "error",
      buttonPrimaryText: "Delete",
      onClickPrimary: () => {
        console.log("Send to opinion providers");
      },
      show: true,
    });
  };

  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  //Count Selected Opinion Providers
  const [numOfSelected, setNumOfSelected] = useState<number>(0);
  const [selectedOpinionProviders, setSelectedOpinionProviders] = useState<number[]>([]);
  const countSelected = (isSelected: boolean, opinionProviderId: number) => {
    if (isSelected) {
      setNumOfSelected(numOfSelected + 1);
      setSelectedOpinionProviders([...selectedOpinionProviders, opinionProviderId]);
    } else {
      setNumOfSelected(numOfSelected - 1);
      setSelectedOpinionProviders(selectedOpinionProviders.filter((id) => id !== opinionProviderId));
    }
  };

  const attachments = [
    {
      attachmentTitle: "Pogodba o izvedbi del - 1. faza",
      attachmentPath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      attachmentTitle: "Opis statike gradbene konstrukcije iz strani statika",
      attachmentPath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      attachmentTitle: "Opis statike gradbene konstrukcije iz strani statika",
      attachmentPath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  const opinionProviders = [
    {
      id: 1,
      name: "John Doe",
    },
    {
      id: 2,
      name: "Jane Doe",
    },
    {
      id: 3,
      name: "Michael Jackson",
    },
  ];

  useEffect(() => {
    if (foundProject) {
      setProject(foundProject);
    }
  }, [foundProject]);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="px-40 mb-10">
      <BreadCrumbs />
      <ProgressBar className="my-16" actualPhase={2} selectedPhase={selectedPhase} handlePhaseChange={(phase: number) => setSelectedPhase(phase)} />
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-semibold text-neutral-900">Proj-{project.id}</h1>
        <div className="flex items-center gap-2">
          <IconButton className="text-white bg-main-200 hover:text-main-200 hover:bg-white" icon={<FaPaperclip />} text={"Attachments"} onClick={() => setIsAttachmentsPopupOpen(true)} />
          <DocumentDropdown documentId={project.dppUrl ?? ""} documentType="dpp" isPresent={isDPPPresent} onDocumentChange={onDocumentChange} />
        </div>
      </div>
      <div className="grid grid-cols-8 gap-12 border-b border-gray-900/10 mb-10">
        <div className="col-span-3 pb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Construction details</h2>
          <IconCard icon={<FaHeading />} title="Construction Title" value={project.constructionTitle} />
          <IconCard icon={<FaTag />} title="Construction Type" value={project.constructionType} />
          <IconCard icon={<FaFileContract />} title="Impact on Environment?" value={project.constructionImpactsEnvironment ? "Yes" : "No"} />
        </div>
        <div className="border-b col-span-5 border-gray-900/10">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Investors</h2>
          {/*<InvestorsTable investors={project} />*/}
        </div>
      </div>
      {isAttachmentsPopupOpen && <AttachmentsPopup opinionProviderId={0} onClose={() => setIsAttachmentsPopupOpen(false)} />}
      <RoleBasedComponent
        projectManagerComponent={
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Opinion Providers</h2>
            {opinionProviders.map((opinionProvider) => (
              <OpinionProvider
                opinionProvider={opinionProvider}
                key={opinionProvider.id}
                countSelected={countSelected}
                handleAttachments={() => setIsAttachmentsPopupOpen(true)}
                handleRemove={handleRemove}
              />
            ))}
            <IconButton text={numOfSelected > 0 ? "Send Selected" : "Send All"} icon={<FaArrowUp />} onClick={handleSend} />
          </div>
        }
      />
      <RoleBasedComponent
        opinionProviderComponent={
          <div>
            <div className="grid grid-cols-4 gap-5 mb-10">
              <IconCard icon={<FaUser />} title="Project Manager" value={"Marko Skače"} />
              <IconCard
                className="col-span-3"
                icon={<FaHourglass />}
                title="Assessment Deadline"
                value="12.12.2023"
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
            <h2 className="text-2xl font-semibold my-5">Upload Assessment</h2>
            <InputField label="" type="text" id={"attachment"} placeholder={"Assessment Name"} />
            <DocumentInput onDocumentChange={onDocumentChange} />
            <div className="flex justify-end gap-4">
              <IconButton className="mt-3 bg-white text-main-200 hover:bg-main-200 hover:text-white" text="Add Attachments" icon={<FaPaperclip />} onClick={() => setIsAttachmentsPopupOpen(true)} />
              <IconButton className="mt-3 bg-main-200 text-white hover:bg-white hover:text-main-200" text="Upload" icon={<FaUpload />} onClick={() => {}} />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProjectPage;
