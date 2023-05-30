import { FaArrowUp, FaExclamation } from "react-icons/fa";

interface PopupWithActionsProps {
  type: "send" | "delete";
  onClickPrimary: () => {};
  onClickSecondary: () => {};
}

const DeleteConfirmation = (props: PopupWithActionsProps) => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="max-w-md w-full rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8 relative " role="alert">
        <div className="flex items-center gap-4">
          <span className="shrink-0 rounded-full p-2 text-red-500">
            <FaExclamation size={20} />
          </span>
          <p className="font-medium sm:text-lg">Delete Opinion Provider</p>
        </div>
        <p className="mt-4 text-gray-500">Are you sure you want to remove this opinion provider? This action cannot be undone.</p>
        <div className="mt-6 sm:flex sm:gap-4">
          <button className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto" onClick={props.onClickPrimary}>
            Delete
          </button>

          <button className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto" onClick={props.onClickSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SendConformation = (props: PopupWithActionsProps) => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="max-w-md w-full rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8 relative " role="alert">
        <div className="flex items-center gap-4">
          <span className="shrink-0 rounded-full text-main-200 p-2">
            <FaArrowUp size={20} />
          </span>
          <p className="font-medium sm:text-lg">Send project to opinion providers</p>
        </div>
        <p className="mt-4 text-gray-500">This action will send the project to the selected opinion providers.</p>
        <div className="mt-6 sm:flex sm:gap-4">
          <button className="inline-block w-full rounded-lg bg-main-200 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto" onClick={props.onClickPrimary}>
            Send
          </button>

          <button className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto" onClick={props.onClickSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const PopupWithActions = (props: PopupWithActionsProps) => {
  return <>{props.type === "send" ? <SendConformation {...props} /> : <DeleteConfirmation {...props} />}</>;
};

export default PopupWithActions;
