import { useContext } from "react";
import ConformationPopupContext from "../context/ConformationPopupContext";

const useConformationPopup = () => useContext(ConformationPopupContext);

export default useConformationPopup;
