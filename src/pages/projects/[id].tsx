import { findProjectById } from "@/lib/ProjectService";
import { ProjectState, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { BreadCrumbs } from "@/components/generic/navigation/Breadcrumbs";
import {
  FaArrowUp,
  FaCalendarPlus,
  FaCheck,
  FaCheckCircle,
  FaEdit,
  FaFileContract,
  FaHeading,
  FaHourglass,
  FaLandmark,
  FaPaperclip,
  FaPaperPlane,
  FaPlus,
  FaQuestion,
  FaTag,
  FaUpload,
  FaUser,
} from "react-icons/all";
import IconButton from "@/components/generic/buttons/IconButton";
import DocumentDropdown from "@/components/generic/dropdown/DocumentDropdown";
import IconCard from "@/components/generic/data-view/IconCard";
import AssessmentProviderListItem from "@/components/specific/AssessmentProviderListItem";
//import useConformationPopup from "@/hooks/ConformationPopupHook";
import ProgressBar from "@/components/specific/ProgressBar";
import RoleBasedComponent from "@/components/generic/RoleBasedComponent";
import DocumentInput from "@/components/generic/input/DocumentInput";
import InputField from "@/components/generic/input/InputField";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import { setRecentProject } from "@/utils/LocalStorageUtil";
import AddAssessmentProvidersPopup from "@/components/specific/AddAssessmentProvidersPopup";
import { ProjectModel } from "@/models/ProjectModel";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import InvestorsView from "@/components/specific/InvestorsView";
import { useRouter } from "next/router";
import { getConnectedAddress } from "../../utils/MetamaskUtils";
import { getFileNamesWithHashesFromDirectory, zipAndDownload } from "../../lib/DocumentService";
import useAlert from "../../hooks/AlertHook";
import Link from "next/link";
import { getSentMainDocumentText, getSetMainDocumentText, mailUser } from "../../utils/MailingUtils";
import AdministrativeAuthorityPopup from "@/components/specific/AdministrativeAuthorityPopup";

export const getServerSideProps: any = async (context: any) => {
  const id = context.params ? context.params.id : "";

  try {
    let project: ProjectModel = await findProjectById(id?.toString() ?? "");
    return { props: { project } };
  } catch (error) {
    return { notFound: true };
  }
};

const ProjectPage = ({ project }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  //const { setConformationPopup } = useConformationPopup();
  const { setAlert } = useAlert();
  const [isAddAssessmentProvidersPopupOpen, setIsAddAssessmentProvidersPopupOpen] = useState<boolean>(false);
  const [isAdministrativeAuthorityPopupOpen, setIsAdministrativeAuthorityPopupOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<ProjectState>(project.ProjectState);

  useEffect(() => {
    setRecentProject(project.baseProject.id);
  }, []);

  //Count Selected Opinion Providers
  const [numOfSelected, setNumOfSelected] = useState<number>(0);
  const [selectedAssessmentProviders, setSelectedAssessmentProviders] = useState<string[]>([]);
  const countSelected = (isSelected: boolean, opinionProviderId: string) => {
    if (isSelected) {
      setNumOfSelected(numOfSelected + 1);
      setSelectedAssessmentProviders([...selectedAssessmentProviders, opinionProviderId]);
    } else {
      setNumOfSelected(numOfSelected - 1);
      setSelectedAssessmentProviders(selectedAssessmentProviders.filter((id) => id !== opinionProviderId));
    }
  };

  /*const handleSend = () => {
    setConformationPopup({
      title: "Send to Opinion Providers",
      message: "Are you sure you want to send this project to the selected opinion providers?",
      icon: <FaArrowUp />,
      popupType: "warning",
      buttonPrimaryText: "Send",
      onClickPrimary: sendToAssessmentProviders,
      show: true,
    });
  };*/

  const sendToAssessmentProviders = async () => {
    let selectedAddresses: string[] = [];
    if (selectedAssessmentProviders.length === 0) {
      if (project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS) {
        selectedAddresses = project.assessmentProviders.map((assessmentProvider: User) => {
          const existingDocumentContract = project.sentDPPs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === assessmentProvider.id);
          if (!existingDocumentContract) return assessmentProvider.walletAddress;
        });
      } else if (project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_OPINIONS) {
        selectedAddresses = project.assessmentProviders.map((assessmentProvider: User) => {
          const existingDocumentContract = project.sentDGDs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === assessmentProvider.id);
          if (!existingDocumentContract) return assessmentProvider.walletAddress;
        });
      }
    } else {
      selectedAddresses = selectedAssessmentProviders.map((assessmentProviderId: string) => {
        const assessmentProvider = project.assessmentProviders.find((assessmentProvider: User) => assessmentProvider.id === assessmentProviderId);
        if (assessmentProvider) return assessmentProvider.walletAddress;
      });
    }
    selectedAddresses = selectedAddresses.filter((address: string) => address !== undefined);

    try {
      const path = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "sendDPP" : "sendDGD";

      let assessmentProvidersInfo: { id: string; walletAddress: string; email: string }[] = project.assessmentProviders.map((assessmentProvider: User) => {
        const matchingAssessmentProvider = selectedAddresses.find((address: string) => address === assessmentProvider.walletAddress);
        if (matchingAssessmentProvider)
          return {
            id: assessmentProvider.id,
            walletAddress: assessmentProvider.walletAddress,
            email: assessmentProvider.email,
          };
      });

      assessmentProvidersInfo = assessmentProvidersInfo.filter((info: object) => info !== undefined);

      let documentContractStructs: object[] = [];
      const documentType = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD";
      const connectedAddress = await getConnectedAddress(window);
      for (let info of assessmentProvidersInfo) {
        let attachments: { id: string; documentHash: string; owner?: string }[] = await getFileNamesWithHashesFromDirectory(
          `public/projects/${project.baseProject.id}/${documentType}/${info.id}/attachments`
        );

        for (let attachment of attachments) {
          attachment.owner = connectedAddress;
        }

        documentContractStructs.push({
          assessmentProvider: info.walletAddress,
          attachments: attachments,
        });
      }

      const body = {
        projectAddress: project.baseProject.smartContractAddress,
        signerAddress: connectedAddress,
        documentContractStructs: documentContractStructs,
      };

      const response = await fetch(`/api/projects/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setAlert({ title: "", message: `${documentType} poslan`, type: "success" });
        const subjectText = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektnih pogojev" : "projektnega mnenja";
        const responseMail = await mailUser({
          to: assessmentProvidersInfo.map((ap) => ap.email),
          subject: `${project.baseProject.name} - pridobljena zahteva za pridobitev ${subjectText}`,
          text: getSentMainDocumentText(project.baseProject.name, project.baseProject.projectState),
          link: router.asPath,
        });
        if (!responseMail.ok) throw new Error((await responseMail.json()).message);
        router.push(router.asPath);
      }
    } catch (e: any) {
      setAlert({ title: "", message: e.message, type: "error" });
    }
  };

  const downloadZip = async (paths: string[], zipName: string): Promise<boolean> => {
    try {
      await zipAndDownload(paths, zipName);
    } catch (e: any) {
      console.log(e);
      setAlert({ title: "", message: e.message, type: "error" });
    }
    return false;
  };

  const onMainDocumentChange = async () => {
    const relevantEmails: string[] =
      project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS
        ? project.sentDPPs.map((documentContract: DocumentContractModel) => documentContract.assessmentProvider.email)
        : project.sentDGDs.map((documentContract: DocumentContractModel) => documentContract.assessmentProvider.email);
    try {
      if (relevantEmails.length != 0) {
        const responseMail = await mailUser({
          to: relevantEmails,
          subject: `${project.baseProject.name} - Posodobljen ${project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}`,
          text: getSetMainDocumentText(project.baseProject.name, project.baseProject.projectState),
          link: router.asPath,
        });
        if (!responseMail.ok) throw new Error((await responseMail.json()).message);
      }
    } catch (e: any) {
      setAlert({ title: "", message: "Napaka pri pošiljanju e-pošte", type: "error" });
    } finally {
      router.push(router.asPath);
    }
  };

  const handleAdministrativeAuthorityChange = (): void => {
    setIsAdministrativeAuthorityPopupOpen(false);
    router.push(router.asPath);
  };

  const finalizeDPPPhase = async () => {
    const response = await fetch(`/api/projects/finalizeDPPPhase/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectAddress: project.baseProject.smartContractAddress, signerAddress: await getConnectedAddress(window) }),
    });

    if (response.ok) {
      setAlert({ title: "Uspeh", message: "Projekt zaključen", type: "success" });
      router.push(router.asPath);
    } else {
      setAlert({ title: "Napaka", message: "Napaka pri zaključevanju projekta", type: "error" });
    }
  };

  /*const investorRelevantInfo = {
    projectName: project.baseProject.name,
    projectManagerInfo: project.baseProject.projectManager,
    numOfAssessmentProviders: project.baseProject.numOfAssessmentProviders,
    numOfSentDPPs: project.baseProject.numOfSentDPPs,
    numOfAssessedDPPs: project.baseProject.numOfAssessedDPPs,
    numOfSentDGDs: project.baseProject.numOfSentDGDs,
    numOfAssessedDGDs: project.baseProject.numOfAssessedDGDs
  };*/
  // public/projects/:projectId/DPP
  // public/project/:projectId/DPP/:assessmentProviderId/attachments
  // public/project/:projectId/DPP/:assessmentProviderId/assessment
  // public/project/:projectId/DPP/:assessmentProviderId/assessment/attachments
  // public/projects/:projectId/DGD
  // public/project/:projectId/DGD/:assessmentProviderId/attachments
  // public/project/:projectId/DGD/:assessmentProviderId/assessment
  // public/project/:projectId/DGD/:assessmentProviderId/assessment/attachments
  return (
    <div className="px-40 mb-10">
      <BreadCrumbs />
      <ProgressBar className="my-16" actualState={project.baseProject.projectState} selectedState={selectedState} handleStateChange={(state: ProjectState) => setSelectedState(state)} />
      <div className="flex justify-between mb-10">
        <span className="inline-flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-neutral-900">{project.baseProject.name}</h1>
          {/* <RoleBasedComponent
            projectManagerComponent={ */}
          <Link href={`/projects/editProject/${project.baseProject.id}`}>
            <IconButton className="text-main-200 border-gray-50 rounded-none hover:border-b-main-200" icon={<FaEdit />} text={"Edit Project"} onClick={() => {}} />
          </Link>
        </span>
        <div className="flex items-center gap-5">
          {/* <RoleBasedComponent
            assessmentProviderComponent={ */}
          <>
            <IconButton
              className="text-main-200 border-gray-50 bg-inherit rounded-none hover:border-b-main-200"
              icon={project.administrativeAuthority ? <FaLandmark /> : <FaPlus />}
              text={project.administrativeAuthority ? project.administrativeAuthority.name : "Dodaj upravni organ"}
              onClick={() => setIsAdministrativeAuthorityPopupOpen(true)}
            />
            {isAdministrativeAuthorityPopupOpen && (
              <AdministrativeAuthorityPopup
                administrativeAuthority={project.administrativeAuthority ? project.administrativeAuthority : null}
                projectAddress={project.baseProject.smartContractAddress}
                onClose={() => setIsAdministrativeAuthorityPopupOpen(false)}
                onSubmit={() => handleAdministrativeAuthorityChange()}
              />
            )}
          </>
          <RoleBasedComponent
            assessmentProviderComponent={<IconButton className="text-white bg-main-200 hover:text-main-200 hover:bg-white" icon={<FaPaperclip />} text={"Attachments"} onClick={() => {}} />}
          />
          <DocumentDropdown
            documentId={project.DPPUrl ?? ""}
            documentType="dpp"
            isPresent={project.DPPUrl != undefined}
            fileName={project.DPPUrl}
            path={`projects/${project.baseProject.id}/${project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD"}`}
            onDocumentChange={onMainDocumentChange}
            projectAddress={project.baseProject.smartContractAddress}
          />
        </div>
      </div>
      <div className="my-10 py-5 border-y border-gray-200">
        <p className="text-gray-500 text-sm">Description</p>
        <p className="text-black mt-2">{project.baseProject.description}</p>
      </div>
      <div className="grid grid-cols-8 gap-12 border-b border-gray-900/10 mb-10">
        <div className="col-span-3 pb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Construction details</h2>
          <IconCard icon={<FaHeading />} title="Construction Title" value={project.baseProject.constructionTitle} />
          <IconCard icon={<FaTag />} title="Construction Type" value={project.baseProject.constructionType} />
          <IconCard icon={<FaFileContract />} title="Impact on Environment?" value={project.baseProject.constructionImpactsEnvironment ? "Yes" : "No"} />
        </div>
        <div className="col-span-5">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-5">Investors</h2>
          <InvestorsView investors={project.baseProject.investors} projectId={project.baseProject.id} projectUpdateInfo={{
            projectName: project.baseProject.name,
            projectManagerInfo: project.projectManager,
            numOfAssessmentProviders: project.numOfAssessmentProviders,
            numOfSentDPPs: project.numOfSentDPPs,
            numOfAssessedDPPs: project.numOfAssessedDPPs,
            numOfSentDGDs: project.numOfSentDGDs,
            numOfAssessedDGDs: project.numOfAssessedDGDs
          }}/>
        </div>
      </div>
      {/*<RoleBasedComponent*/}
      {/*  projectManagerComponent={*/}
      <div className="overflow-x-auto">
        <span className="inline-flex items-center gap-5 mb-5">
          <h2 className="text-2xl font-semibold text-neutral-900">Mnenjedajalci</h2>
          {project.projectState != ProjectState.AQUIRING_PROJECT_CONDITIONS && (
            <IconButton
              className="text-main-200 border-gray-50 rounded-none hover:border-b-main-200"
              text={"Dodaj mnenjedajalca"}
              icon={<FaPlus />}
              onClick={() => setIsAddAssessmentProvidersPopupOpen(true)}
            />
          )}
          {isAddAssessmentProvidersPopupOpen && (
            <AddAssessmentProvidersPopup
              onClose={() => setIsAddAssessmentProvidersPopupOpen(false)}
              projectAddress={project.baseProject.smartContractAddress}
              projectId={project.baseProject.id}
              existingAssessmentProviders={project.assessmentProviders}
            />
          )}
        </span>
        {project.assessmentProviders.map((assessmentProvider: User) => (
          <AssessmentProviderListItem
            assessmentProvider={assessmentProvider}
            projectId={project.baseProject.id}
            projectState={project.baseProject.projectState}
            documentContract={project.sentDPPs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === assessmentProvider.id)}
            key={assessmentProvider.id}
            countSelected={countSelected}
            isMainDocumentPresent={project.DPPUrl != undefined || project.DGDUrl != undefined}
            projectAddress={project.baseProject.smartContractAddress}
            projectName={project.baseProject.name}
            downloadAssessment={downloadZip}
          />
        ))}
        <div className="flex justify-end mb-20">
          {project.assessmentProviders.length > 0 &&
            (project.DPPUrl || project.DGDUrl) &&
            (project.sentDPPs.length !== project.assessmentProviders.length || project.sentDGDs.length !== project.assessmentProviders.length) && (
              <IconButton
                className="bg-main-200 text-white hover:bg-white hover:text-main-200"
                text={numOfSelected > 0 ? "Pošlji izbranim" : "Pošlji vsem"}
                icon={<FaPaperPlane />}
                onClick={sendToAssessmentProviders}
              />
            )}
          {project.numOfSentDPPs != 0 && project.sentDPPs.filter((documentContract: DocumentContractModel) => documentContract.isClosed === true).length === project.assessmentProviders.length && (
            <IconButton className="bg-green-600 text-white hover:bg-white hover:text-green-600" text={"Zaključi prvo fazo"} icon={<FaCheckCircle />} onClick={finalizeDPPPhase} />
          )}
        </div>
      </div>
      {/*} />*/}
      <RoleBasedComponent
        assessmentProviderComponent={
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
            <DocumentInput onDocumentChange={() => {}} />
            <div className="flex justify-end gap-4">
              <IconButton className="mt-3 bg-white text-main-200 hover:bg-main-200 hover:text-white" text="Add Attachments" icon={<FaPaperclip />} onClick={() => {}} />
              <IconButton className="mt-3 bg-main-200 text-white hover:bg-white hover:text-main-200" text="Upload" icon={<FaUpload />} onClick={() => {}} />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProjectPage;
