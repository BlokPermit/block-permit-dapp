import useConformationPopup from "@/hooks/ConformationPopupHook";
import { useEffect, useState } from "react";

const ConformationPopup = () => {
  const props = useConformationPopup();
  const [show, setShow] = useState<boolean>(false);
  const [color, setColor] = useState<string>("");
  useEffect(() => {
    setShow(props.show);
    switch (props.popupType) {
      case "success":
        setColor("green-300");
        break;
      case "error":
        setColor("red-400");
        break;
      case "warning":
        setColor("main-200");
        break;
      case "info":
        setColor("gray-200");
        break;
      default:
    }
  }, [props]);

  return (
    <>
      {show && (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="max-w-md w-full rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8 relative" role="alert">
            <div className="flex items-center gap-4">
              <span className={`shrink-0 rounded-full p-2 text-${color}`}>{props.icon}</span>
              <p className="font-medium sm:text-lg">{props.title}</p>
            </div>
            <p className="mt-4 text-gray-500">{props.message}</p>
            <div className="mt-6 sm:flex sm:gap-4">
              <button className={`inline-block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto bg-${color}`} onClick={props.onClickPrimary}>
                {props.buttonPrimaryText}
              </button>

              <button className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto" onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConformationPopup;
