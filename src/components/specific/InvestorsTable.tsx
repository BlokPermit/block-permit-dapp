import { Investor } from "@prisma/client";
import React from "react";

interface InvestorsTableProps {
  investors: Investor[];
}

const InvestorsTable = (props: InvestorsTableProps) => {
  const [isAddInvestorsToggled, setIsAddInvestorsToggled] = React.useState<boolean>(false);
  return (
    <>
      <div>
        <table className="min-w-full">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap text-gray-500 text-sm font-normal">Name</th>
              <th className="whitespace-nowrap text-gray-500 text-sm font-normal">Street Address</th>
              <th className="whitespace-nowrap text-gray-500 text-sm font-normal">Tax ID</th>
            </tr>
          </thead>

          <tbody>
            {props.investors.map((investor: Investor) => (
              <tr key={investor.id}>
                <td className="whitespace-nowrap px-3 py-6">{investor.name}</td>
                <td className="whitespace-nowrap py-6">{investor.streetAddress}</td>
                <td className="whitespace-nowrap py-6">{investor.taxId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvestorsTable;
