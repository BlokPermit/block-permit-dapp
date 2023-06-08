import { Investor } from "@prisma/client";
import IconCard from "../generic/data-view/IconCard";
import { FaEnvelope, FaHeading, FaIdBadge, FaMapMarked, FaMapMarker, FaMarker, FaPhone, FaStreetView, FaTimes } from "react-icons/fa";

interface InvestorInfoPopupProps {
  investor: Investor;
  onClose: () => void;
}

const InvestorInfoPopup = (props: InvestorInfoPopupProps) => {
  //name          String
  // streetAddress String
  // phoneNumber   String
  // email         String
  // taxId         String

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
      <span onClick={props.onClose} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30"></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute right-5 top-5 hover:text-gray-200 hover:cursor-pointer" onClick={props.onClose}>
          <FaTimes />
        </div>
        <div className="mt-5">
          <IconCard title={"Name"} value={props.investor.name} icon={<FaHeading />} />
          <IconCard title={"Street Address"} value={props.investor.streetAddress} icon={<FaMapMarker />} />
          <IconCard title={"Phone Number"} value={props.investor.phoneNumber} icon={<FaPhone />} />
          <IconCard title={"Email"} value={props.investor.email} icon={<FaEnvelope />} />
          <IconCard title={"Tax Id"} value={props.investor.taxId} icon={<FaIdBadge />} />
        </div>
      </div>
    </div>
  );
};

export default InvestorInfoPopup;
