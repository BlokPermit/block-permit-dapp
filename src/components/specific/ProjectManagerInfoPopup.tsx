import { User } from "@prisma/client";
import IconCard from "../generic/data-view/IconCard";
import { FaEnvelope, FaHeading, FaIdBadge, FaMapMarked, FaMapMarker, FaMarker, FaPhone, FaStreetView, FaTimes } from "react-icons/fa";

interface ProjectManagerInfoPopupProps {
  projectManager: User;
  onClose: () => void;
}

const ProjectManagerInfoPopup = (props: ProjectManagerInfoPopupProps) => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
      <span onClick={props.onClose} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30"></span>
      <div className="max-w-6xl w-full rounded-lg bg-gray-100 p-4 shadow-lg sm:p-6 lg:p-8 relative">
        <div className="absolute right-5 top-5 hover:text-gray-200 hover:cursor-pointer" onClick={props.onClose}>
          <FaTimes />
        </div>
        <div className="mt-5">
          <IconCard title={"Name"} value={props.projectManager.name} icon={<FaHeading />} />
          <IconCard title={"Street Address"} value={props.projectManager.streetAddress} icon={<FaMapMarker />} />
          {props.projectManager.phone && <IconCard title={"Phone Number"} value={props.projectManager.phone} icon={<FaPhone />} />}
          <IconCard title={"Email"} value={props.projectManager.email} icon={<FaEnvelope />} />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerInfoPopup;
