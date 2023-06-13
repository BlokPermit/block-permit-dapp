import { ProjectModel } from "@/models/ProjectModel";
import { ProjectState, User } from "@prisma/client";
import AddAssessmentProvidersPopup from "./AddAssessmentProvidersPopup";
import AssessmentProviderListItem from "./AssessmentProviderListItem";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import { useRouter } from "next/router";
import useAlert from "@/hooks/AlertHook";
import useConformationPopup from "@/hooks/ConformationPopupHook";
import {FaArrowUp, FaBuilding, FaCheckCircle, FaInfo, FaPaperPlane, FaPlus, FaUser} from "react-icons/fa";
import { useState } from "react";
import { getConnectedAddress } from "@/utils/MetamaskUtils";
import { getFileNamesWithHashesFromDirectory } from "../../lib/DocumentService";
import { getBuildingPermitContractSentText, getSentMainDocumentText, mailUser } from "@/utils/MailingUtils";
import IconButton from "../generic/buttons/IconButton";
import ProjectManagerInfoPopup from "./ProjectManagerInfoPopup";
import IconCard from "../generic/data-view/IconCard";
import ButtonGroup from "../generic/buttons/ButtonGroup";

interface AdministrativeAuthorityViewProps {
    project: ProjectModel;
    selectedState: ProjectState;
    downloadZip: (paths: string[], zipName: string) => Promise<boolean>;
}

const AdministrativeAuthorityView = ({ project, selectedState, downloadZip }: AdministrativeAuthorityViewProps) => {
    const { setAlert } = useAlert();
    const { setConformationPopup } = useConformationPopup();

    const handleConstructionPermitRequest = () => {
        setConformationPopup({
            title: "Zahtevek za izdajo gradbenega dovoljenja",
            message: "Ali ste prepričani, da želite upravnemu organu poslati zahtevek za izdajo gradbenega dovoljenja?",
            icon: <FaArrowUp />,
            popupType: "warning",
            buttonPrimaryText: "Pošlji",
            onClickPrimary: requestConstructionPermit,
            show: true,
        });
    };

    return (
        <div className="overflow-x-auto">
      <span className="inline-flex items-center gap-5 mb-5">
        <h2 className="text-2xl font-semibold text-neutral-900">Mnenjedajalci</h2>
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
                    countSelected={(isSelected: boolean, opinionProviderId: string) => {}}
                    isMainDocumentPresent={selectedState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? project.DPPUrl != undefined : project.DGDUrl != undefined}
                    projectAddress={project.baseProject.smartContractAddress}
                    projectName={project.baseProject.name}
                    downloadAssessment={downloadZip}
                    isDPPPhaseFinalized={project.isDPPPhaseFinalized}
                    isAdministrativeAuthority={true}
                />
            ))}
        </div>
    );
};

export default AdministrativeAuthorityView;
