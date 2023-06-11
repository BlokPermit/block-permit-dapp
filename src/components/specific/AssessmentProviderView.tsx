import { FaCalendarPlus, FaHourglass, FaPaperclip, FaQuestion, FaUpload, FaUser } from "react-icons/fa";
import IconCard from "../generic/data-view/IconCard";
import { ProjectModel } from "@/models/ProjectModel";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import { ProjectState } from "@prisma/client";
import { dateFromTimestamp, formatDate } from "@/utils/DateUtils";
import ButtonGroup from "../generic/buttons/ButtonGroup";
import IconButton from "../generic/buttons/IconButton";
import DocumentInput from "../generic/input/DocumentInput";
import { useEffect, useState } from "react";
import { getConnectedAddress } from "@/utils/MetamaskUtils";

interface AssessmentProviderViewProps {
  project: ProjectModel;
}

const AssessmentProviderView = ({ project }: AssessmentProviderViewProps) => {
  const [loggedInAddress, setLoggedInAddress] = useState<string>("");

  const setUser = async () => {
    setLoggedInAddress(await getConnectedAddress(window));
  };

  useEffect(() => {
    setUser();
  }, []);

  return (
    <div className="mb-10">
      <div className="grid grid-cols-4 gap-5 mb-10">
        <IconCard icon={<FaUser />} title="Projektni vodja" value={project.projectManager.name} />
        <IconCard
          className="col-span-3"
          icon={<FaHourglass />}
          title={project.baseProject.projectState === ProjectState.AQUIRING_PROJECT_CONDITIONS ? "Rok za oddajo pogojev" : "Rok za oddajo mnenja"}
          value={
            project.sentDPPs.map((documentContract: DocumentContractModel) => {
              if (documentContract.assessmentProvider.walletAddress === loggedInAddress) {
                return formatDate(dateFromTimestamp(documentContract.assessmentDueDate));
              }
            })[0] ?? "N/A"
          }
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
      <DocumentInput onDocumentChange={() => {}} />
      <div className="flex justify-end gap-4">
        <IconButton className="mt-3 bg-white text-main-200 hover:bg-main-200 hover:text-white" text="Add Attachments" icon={<FaPaperclip />} onClick={() => {}} />
        <IconButton className="mt-3 bg-main-200 text-white hover:bg-white hover:text-main-200" text="Upload" icon={<FaUpload />} onClick={() => {}} />
      </div>
    </div>
  );
};

export default AssessmentProviderView;
