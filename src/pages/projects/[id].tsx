import { useRouter } from "next/router";
import { findProjectById } from "@/lib/ProjectService";
import { Investor, Project } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import { FaArrowUp, FaFileContract, FaHeading, FaTag, FaTrash } from "react-icons/all";
import IconButton from "@/components/generic/buttons/IconButton";
import DocumentDropdown from "@/components/generic/dropdown/DocumentDropdown";
import IconCard from "@/components/generic/data-view/IconCard";
import InvestorsTable from "@/components/specific/InvestorsTable";
import OpinionProvider from "@/components/specific/OpinionProvider";
import AttachmentsPopup from "@/components/specific/AttachmentsPopup";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import ProgressBar from "@/components/specific/ProgressBar";

export const getServerSideProps: GetServerSideProps<{ foundProject: Project | null }> = async () => {
  const project: Project | null = await findProjectById(1);
  return { props: { foundProject: project } };
};

const ProjectPage = ({ foundProject }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { setConformationPopup } = useConformationPopup();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  const [isDPPPresent, setIsDPDPresent] = useState<boolean>(false);
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

  const investors: Investor[] = [
    {
      id: 1,
      name: "John Doe",
      streetAddress: "1234 Main St, City, State 12345",
      taxId: "123456789",
    },
    {
      id: 2,
      name: "Jane Doe",
      streetAddress: "1234 Main St, City, State 12345",
      taxId: "123456789",
    },
    {
      id: 3,
      name: "Michael Jackson",
      streetAddress: "1234 Main St, City, State 12345",
      taxId: "123456789",
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
      {isAttachmentsPopupOpen && <AttachmentsPopup opinionProviderId={0} onClose={() => setIsAttachmentsPopupOpen(false)} />}
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-semibold text-neutral-900">Proj-{project.id}</h1>
        <DocumentDropdown documentId={project.dpdUrl ?? ""} documentType="dpp" isPresent={isDPPPresent} onDocumentChange={onDocumentChange} />
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
          <InvestorsTable investors={investors} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="mb-10">
          <ProgressBar
            selectedPhase={selectedPhase}
            actualPhase={2}
            handlePhaseChange={(phase: number) => {
              setSelectedPhase(phase);
            }}
          />
        </div>
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
    </div>
  );
};

export default ProjectPage;
