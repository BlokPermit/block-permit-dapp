import { createContext, useCallback, useState } from "react";
import { FaInfo } from "react-icons/fa";

export interface ConformationPopupProps {
  icon: any;
  title: string;
  message: string;
  popupType: "success" | "error" | "warning" | "info";
  buttonPrimaryText: string;
  onClickPrimary: () => void;
  show: boolean;
}

export const initialState: ConformationPopupProps = {
  icon: <FaInfo />,
  title: "",
  message: "",
  popupType: "info",
  buttonPrimaryText: "Submit",
  onClickPrimary: () => {},
  show: false,
};

const ConformationPopupContext = createContext({
  ...initialState,
  setConformationPopup: ({ icon, title, message, popupType, buttonPrimaryText, onClickPrimary, show }: ConformationPopupProps) => {},
  clearConfirmationPopupState: () => {},
});

export const ConformationPopupProvider = ({ children }: any) => {
  const [icon, setIcon] = useState(initialState.icon);
  const [title, setTitle] = useState(initialState.title);
  const [message, setMessage] = useState(initialState.message);
  const [popupType, setType] = useState(initialState.popupType);
  const [buttonPrimaryText, setButtonPrimaryText] = useState(initialState.buttonPrimaryText);
  const [onClickPrimary, setOnClickPrimary] = useState<() => void>(() => () => {});
  const [show, setShow] = useState(initialState.show);

  const setConformationPopup = useCallback(({ icon, title, message, popupType, buttonPrimaryText, onClickPrimary, show }: ConformationPopupProps) => {
    setIcon(icon);
    setTitle(title);
    setMessage(message);
    setType(popupType);
    setButtonPrimaryText(buttonPrimaryText);
    setOnClickPrimary(() => onClickPrimary);
    setShow(show);
  }, []);

  const clearConfirmationPopupState = useCallback(() => {
    // Remove the parameter from this function
    setIcon(initialState.icon);
    setTitle(initialState.title);
    setMessage(initialState.message);
    setType(initialState.popupType);
    setButtonPrimaryText(initialState.buttonPrimaryText);
    setOnClickPrimary(initialState.onClickPrimary);
    setShow(initialState.show);
  }, []);

  return (
    <ConformationPopupContext.Provider
      value={{
        icon,
        title,
        message,
        popupType,
        buttonPrimaryText,
        onClickPrimary,
        show,
        setConformationPopup,
        clearConfirmationPopupState,
      }}
    >
      {children}
    </ConformationPopupContext.Provider>
  );
};

export default ConformationPopupContext;
