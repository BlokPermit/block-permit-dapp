import {Investor} from "@prisma/client";
import React from "react";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import {FaPaperPlane} from "react-icons/all";
import {FaInfo} from "react-icons/fa";

interface InvestorsViewProps {
  investors: Investor[];
}

const InvestorsView = (props: InvestorsViewProps) => {
  const [isAddInvestorsToggled, setIsAddInvestorsToggled] = React.useState<boolean>(false);
  return (
    <>
      <div>
        {props.investors.map((investor: Investor) => (
            <InvestorListItem investor={investor} />
        ))}
      </div>
    </>
  );
};

interface InvestorListItemProps {
    investor: Investor;
}
const InvestorListItem = (props: InvestorListItemProps) => {
  return (
      <div key={props.investor.id} className="mb-3 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-lg">{props.investor.name}</div>
          <div>
            <ButtonGroup secondaryButtons={[
              {
                text: "More Info",
                icon: <FaInfo />,
                onClick: () => {},
              }
            ]} primaryButton={
              {
                text: "Send Update",
                icon: <FaPaperPlane />,
                onClick: () => {},
              }
            } />
          </div>
        </div>
      </div>
  );
}

export default InvestorsView;
