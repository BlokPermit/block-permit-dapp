import {Investor} from "@prisma/client";
import React, {useState} from "react";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import {FaPaperPlane} from "react-icons/all";
import {FaInfo} from "react-icons/fa";
import InvestorInfoPopup from "./InvestorInfoPopup";

interface InvestorsViewProps {
  investors: Investor[];
}

const InvestorsView = (props: InvestorsViewProps) => {
  const [isInvestorInfoPopupOpen, setIsInvestorInfoPopupOpen] = useState<boolean>(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  const handleMoreInfoClick = (investor: Investor) => {
    if (!investor) return;
    setSelectedInvestor(investor);
    setIsInvestorInfoPopupOpen(true);
  };

  return (
    <>
      {isInvestorInfoPopupOpen && <InvestorInfoPopup investor={selectedInvestor!} onClose={() => setIsInvestorInfoPopupOpen(false)} />}
      <div>
        {props.investors.map((investor: Investor) => (
          <InvestorListItem investor={investor} moreInfoClick={(investor: Investor) => handleMoreInfoClick(investor)} sendUpdateClick={(investor: Investor) => console.log(investor.id)} />
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
    <div key={props.investor.id} className="mb-3 pb-3">
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
