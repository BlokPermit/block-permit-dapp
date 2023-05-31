import ConformationPopup from "@/components/generic/notifications/ConformationPopup";
import { init } from "next/dist/compiled/@vercel/og/satori";
import { createContext, useState } from "react";
import { FaInfo } from "react-icons/fa";

export interface ConformationPopupProps {
  icon: any;
  title: string;
  message: string;
  popupType: "success" | "error" | "warning" | "info";
  onClickPrimary: () => {} | void;
  onClickSecondary: () => {} | void;
}

const initialState: ConformationPopupProps = {
  icon: <FaInfo />,
  title: "This ConformationPopup is not initialized yet",
  message: "Please wait for the ConformationPopup to initialize",
  popupType: "info",
  onClickPrimary: () => {},
  onClickSecondary: () => {},
};

const ConformationPopupContext = createContext({
  ...initialState,
  setConformationPopup: ({ icon, title, message, popupType, onClickPrimary, onClickSecondary }: ConformationPopupProps) => {},
});

export const ConformationPopupProvider = ({ children }: any) => {
  const [icon, setIcon] = useState(initialState.icon);
  const [title, setTitle] = useState(initialState.title);
  const [message, setMessage] = useState(initialState.message);
  const [popupType, setType] = useState(initialState.popupType);
  const [onClickPrimary, setOnClickPrimary] = useState(() => initialState.onClickPrimary);
  const [onClickSecondary, setOnClickSecondary] = useState(() => initialState.onClickSecondary);

  const setConformationPopup = ({ icon, title, message, popupType, onClickPrimary, onClickSecondary }: ConformationPopupProps) => {
    setIcon(icon);
    setTitle(title);
    setMessage(message);
    setType(popupType);
    setOnClickPrimary(onClickPrimary);
    setOnClickSecondary(onClickSecondary);
  };

  return (
    <ConformationPopupContext.Provider
      value={{
        icon,
        title,
        message,
        popupType,
        onClickPrimary,
        onClickSecondary,
        setConformationPopup,
      }}
    >
      {children}
    </ConformationPopupContext.Provider>
  );
};

export default ConformationPopupContext;
