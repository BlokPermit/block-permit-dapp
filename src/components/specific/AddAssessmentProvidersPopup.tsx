import { AssessmentProviderModel } from "@/models/AssessmentProviderModel";
import InputField from "../generic/input/InputField";
import OpinionProvider from "./OpinionProvider";
import { FaCheck, FaPlus, FaSearch } from "react-icons/fa";
import IconButton from "../generic/buttons/IconButton";
import { useState } from "react";

interface AddAssessmentProvidersPopupProps {
  projectId: string;
  onClose: () => void;
}

const AddAssessmentProvidersPopup = (props: AddAssessmentProvidersPopupProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);

  const handleSearch = () => {
    setResultsVisible(true);
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <span className="fixed top-0 left-0 w-full h-full" onClick={props.onClose}></span>
      <span className="bg-white max-w-6xl w-1/2 rounded-lg shadow-xl left-40 bottom-52 relative">
        <div className="grid grid-cols-7 gap-2 m-3">
          <input className="col-span-5 border-none rounded-lg p-3 bg-gray-200" type="text" placeholder="Search Assessment Providers" onChange={(e) => setSearchQuery(e.target.value)} />
          <IconButton className="bg-gray-200" text="Search" icon={<FaSearch />} onClick={handleSearch} />
          <IconButton className="bg-main-200 text-white" text="Submit" icon={<FaPlus />} />
        </div>
        {resultsVisible && (
          <div className="p-3">
            <span className="p-3 flex justify-between items-center rounded-lg hover:bg-gray-200 hover:cursor-pointer">
              <div>Jack Nickelson</div>
              {true && <FaCheck color="green" />}
            </span>
          </div>
        )}
      </span>
    </div>
  );
};

export default AddAssessmentProvidersPopup;
