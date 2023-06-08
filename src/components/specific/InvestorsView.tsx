import { Investor } from "@prisma/client";
import React, { useState } from "react";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import { FaPaperPlane } from "react-icons/all";
import { FaInfo } from "react-icons/fa";
import InvestorInfoPopup from "./InvestorInfoPopup";
import {mailInvestor} from "../../utils/MailingUtils";
import useAlert from "../../hooks/AlertHook";

interface InvestorsViewProps {
  investors: Investor[];
}

const InvestorsView = (props: InvestorsViewProps) => {
  const [isInvestorInfoPopupOpen, setIsInvestorInfoPopupOpen] = useState<boolean>(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const { setAlert } = useAlert();

  const handleMoreInfoClick = (investor: Investor) => {
    if (!investor) return;
    setSelectedInvestor(investor);
    setIsInvestorInfoPopupOpen(true);
  };

  const handleSendUpdateClick = async (investor: Investor) => {
    if (!investor) return;
    const response: Response = await mailInvestor({
      to: investor.email,
      subject: "Poročilo o projektu",
      text: "Poslano vam je bilo poročilo o projektu"
    })

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
        {props.investors.map((investor: Investor) => (
          <div key={investor.id}>
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
          <ButtonGroup
            secondaryButtons={[
              {
                text: "More Info",
                icon: <FaInfo />,
                onClick: () => {
                  props.moreInfoClick(props.investor);
                },
              },
            ]}
            primaryButton={{
              text: "Send Update",
              icon: <FaPaperPlane />,
              onClick: () => {
                props.sendUpdateClick(props.investor);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorsView;
