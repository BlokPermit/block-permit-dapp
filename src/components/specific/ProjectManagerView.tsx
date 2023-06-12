import { ProjectModel } from "@/models/ProjectModel";
import { ProjectState, User } from "@prisma/client";
import AddAssessmentProvidersPopup from "./AddAssessmentProvidersPopup";
import AssessmentProviderListItem from "./AssessmentProviderListItem";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import { useRouter } from "next/router";
import useAlert from "@/hooks/AlertHook";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import { FaArrowUp, FaCheckCircle, FaPaperPlane, FaPlus } from "react-icons/fa";
import { useState } from "react";
import { getConnectedAddress } from "@/utils/MetamaskUtils";
import { getFileNamesWithHashesFromDirectory } from "../../lib/DocumentService";
import { getSentMainDocumentText, mailUser } from "@/utils/MailingUtils";
import IconButton from "../generic/buttons/IconButton";

interface ProjectManagerViewProps {
  project: ProjectModel;
  selectedState: ProjectState;
  downloadZip: (paths: string[], zipName: string) => Promise<boolean>;
}

const ProjectManagerView = ({ project, selectedState, downloadZip }: ProjectManagerViewProps) => {
  const router = useRouter();
  const { setAlert } = useAlert();
  const { setConformationPopup } = useConformationPopup();

  const [isAddAssessmentProvidersPopupOpen, setIsAddAssessmentProvidersPopupOpen] = useState<boolean>(false);

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

  const handleSend = () => {
    setConformationPopup({
      title: "Pošlji mnenjedajalcem",
      message: "Ali ste prepričani, da želite poslati mnenjedajalcem?",
      icon: <FaArrowUp />,
      popupType: "warning",
      buttonPrimaryText: "Pošlji",
      onClickPrimary: sendToAssessmentProviders,
      show: true,
    });
  };

  const sendToAssessmentProviders = async () => {
    let selectedAddresses: (string | undefined)[] = [];
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
    selectedAddresses = selectedAddresses.filter((address: string | undefined) => address !== undefined);

    try {
      const path = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "sendDPP" : "sendDGD";

      let assessmentProvidersInfo: ({ id: string; walletAddress: string; email: string } | undefined)[] = project.assessmentProviders.map((assessmentProvider: User) => {
        const matchingAssessmentProvider = selectedAddresses.find((address: string | undefined) => address === assessmentProvider.walletAddress);
        if (matchingAssessmentProvider)
          return {
            id: assessmentProvider.id,
            walletAddress: assessmentProvider.walletAddress,
            email: assessmentProvider.email,
          };
      });

      assessmentProvidersInfo = assessmentProvidersInfo.filter((info: object | undefined) => info !== undefined);

      let documentContractStructs: object[] = [];
      const documentType = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD";
      const connectedAddress = await getConnectedAddress(window);
      for (let info of assessmentProvidersInfo) {
        let attachments: { id: string; documentHash: string; owner?: string }[] = await getFileNamesWithHashesFromDirectory(
          `public/projects/${project.baseProject.id}/${documentType}/${info!.id}/attachments`
        );

        for (let attachment of attachments) {
          attachment.owner = connectedAddress;
        }

        documentContractStructs.push({
          assessmentProvider: info!.walletAddress,
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
        if (assessmentProvidersInfo.length !== 0) {
          const subjectText = project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektnih pogojev" : "projektnega mnenja";
          const responseMail = await mailUser({
            to: assessmentProvidersInfo.map((ap) => ap!.email),
            subject: `${project.baseProject.name} - pridobljena zahteva za pridobitev ${subjectText}`,
            text: getSentMainDocumentText(project.baseProject.name, project.baseProject.projectState),
            link: router.asPath,
          });
          if (!responseMail.ok) throw new Error((await responseMail.json()).message);
        }
        router.reload();
      }
    } catch (e: any) {
      setAlert({ title: "", message: e.message, type: "error" });
      router.reload();
    }
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
      setAlert({ title: "Uspeh", message: "Faza pridobivanja projektnih pogojev zaključena", type: "success" });
      router.push(router.asPath);
    } else {
      setAlert({ title: "Napaka", message: "Napaka pri zaključevanju faze pridobivanja projektnih pogojev", type: "error" });
    }
  };

  return (
    <div className="overflow-x-auto">
      <span className="inline-flex items-center gap-5 mb-5">
        <h2 className="text-2xl font-semibold text-neutral-900">Mnenjedajalci</h2>
        {project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS && (
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
          actualProjectState={project.baseProject.projectState}
          selectedProjectState={selectedState}
          documentContract={
            selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS
              ? project.sentDPPs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === assessmentProvider.id)
              : project.sentDGDs.find((documentContract: DocumentContractModel) => documentContract.assessmentProvider.id === assessmentProvider.id)
          }
          key={assessmentProvider.id}
          countSelected={countSelected}
          isMainDocumentPresent={selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? project.DPPUrl != undefined : project.DGDUrl != undefined}
          projectAddress={project.baseProject.smartContractAddress}
          projectName={project.baseProject.name}
          downloadAssessment={downloadZip}
        />
      ))}
      <div className="flex justify-end mb-20">
        {project.assessmentProviders.length > 0 &&
          ((selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS && project.DPPUrl) || (selectedState === ProjectState.AQUIRING_PROJECT_OPINIONS && project.DGDUrl)) &&
          ((selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS && project.sentDPPs.length !== project.assessmentProviders.length) ||
            (selectedState === ProjectState.AQUIRING_PROJECT_OPINIONS && project.sentDGDs.length !== project.assessmentProviders.length)) && (
            <IconButton
              className="bg-main-200 text-white hover:bg-white hover:text-main-200"
              text={numOfSelected > 0 ? "Pošlji izbranim" : "Pošlji vsem"}
              icon={<FaPaperPlane />}
              onClick={handleSend}
            />
          )}
        {project.baseProject.projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS &&
          project.numOfSentDPPs != 0 &&
          project.sentDPPs.filter((documentContract: DocumentContractModel) => documentContract.isClosed === true).length === project.assessmentProviders.length && (
            <IconButton className="bg-green-600 text-white hover:bg-white hover:text-green-600" text={"Zaključi prvo fazo"} icon={<FaCheckCircle />} onClick={finalizeDPPPhase} />
          )}
      </div>
    </div>
  );
};

export default ProjectManagerView;
