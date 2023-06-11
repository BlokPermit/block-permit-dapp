import { Investor, User } from "@prisma/client";
import React, { useState } from "react";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import { FaPaperPlane } from "react-icons/all";
import { FaInfo } from "react-icons/fa";
import InvestorInfoPopup from "./InvestorInfoPopup";
import { mailInvestor } from "../../utils/MailingUtils";
import useAlert from "../../hooks/AlertHook";
import { useRouter } from "next/router";
import RoleBasedComponent from "../generic/RoleBasedComponent";

interface InvestorsViewProps {
  investors: Investor[];
  projectId: string;
  projectUpdateInfo: {
    projectName: string;
    projectManagerInfo: User;
    numOfAssessmentProviders: number;
    numOfSentDPPs: number;
    numOfAssessedDPPs: number;
    numOfSentDGDs: number;
    numOfAssessedDGDs: number;
  };
}

const InvestorsView = (props: InvestorsViewProps) => {
  const router = useRouter();
  const [isInvestorInfoPopupOpen, setIsInvestorInfoPopupOpen] = useState<boolean>(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const { setAlert } = useAlert();

  const handleMoreInfoClick = (investor: Investor) => {
    if (!investor) return;
    setSelectedInvestor(investor);
    setIsInvestorInfoPopupOpen(true);
  };

  console.log(props.projectUpdateInfo);
  const handleSendUpdateClick = async (investor: Investor) => {
    if (!investor) return;
    const response: Response = await mailInvestor({
      to: [investor.email],
      subject: `Poročilo o projektu ${props.projectUpdateInfo.projectName}`,
      info: props.projectUpdateInfo,
    });

    if (response.ok) {
      setAlert({ title: "", message: `Poročilo poslano`, type: "success" });
    } else {
      setAlert({ title: "", message: (await response.json()).message, type: "error" });
    }

    //await sendEmailToInvestor([investor.email], "Poročilo za projekt", "Poslano vam je bilo sporočilo za projekt");
  };

  return (
    <>
      {isInvestorInfoPopupOpen && <InvestorInfoPopup investor={selectedInvestor!} onClose={() => setIsInvestorInfoPopupOpen(false)} />}
      <div>
        {props.investors.length === 0 && (
          <div className="text-left text-gray-500">
            Na projekt niste dodali nobenega investitorja. To lahko storite{" "}
            <span
              className="text-main-200 underline hover:text-gray-500 hover:cursor-pointer"
              onClick={() => {
                router.push(`/projects/editProject/${props.projectId}`);
              }}
            >
              tukaj
            </span>
            .
          </div>
        )}
        {props.investors.map((investor: Investor) => (
          <div key={investor.taxId}>
            <InvestorListItem investor={investor} moreInfoClick={(investor: Investor) => handleMoreInfoClick(investor)} sendUpdateClick={(investor: Investor) => handleSendUpdateClick(investor)} />
          </div>
        ))}
      </div>
    </>
  );
};

interface InvestorListItemProps {
  investor: Investor;
  moreInfoClick: (investor: Investor) => void;
  sendUpdateClick: (investor: Investor) => void;
}
const InvestorListItem = (props: InvestorListItemProps) => {
  return (
    <div className="mb-3 pb-3">
      <div className="flex justify-between items-center">
        <div className="text-lg">{props.investor.name}</div>
        <div>
          <RoleBasedComponent
            projectManagerComponent={
              <ButtonGroup
                secondaryButtons={[
                  {
                    text: "Več informacij",
                    icon: <FaInfo />,
                    onClick: () => {
                      props.moreInfoClick(props.investor);
                    },
                  },
                ]}
                primaryButton={{
                  text: "Pošlji spremembo",
                  icon: <FaPaperPlane />,
                  onClick: () => {
                    props.sendUpdateClick(props.investor);
                  },
                }}
              />
            }
          />
          <RoleBasedComponent
            assessmentProviderComponent={
              <ButtonGroup
                secondaryButtons={[]}
                primaryButton={{
                  text: "Več informacij",
                  icon: <FaInfo />,
                  onClick: () => {
                    props.moreInfoClick(props.investor);
                  },
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorsView;
