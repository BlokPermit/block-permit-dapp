import { FaArrowUp, FaFile, FaTrash } from "react-icons/all";

interface SecondaryButtonProps {
  onClick?: () => void;
  text: string;
  icon: any;
  disabled?: boolean;
}

interface PrimaryButtonProps {
  onClick?: () => void;
  text: string;
  icon: any;
}

interface ButtonGroupProps {
  secondaryButtons: SecondaryButtonProps[];
  primaryButton: PrimaryButtonProps;
}
const ButtonGroup = (props: ButtonGroupProps) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
      {props.secondaryButtons.map((buttonProps, index) => (
        <span
          className={`${!buttonProps.disabled && "hover:text-main-200 hover:cursor-pointer"} inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-500  focus:relative`}
          onClick={buttonProps.onClick}
        >
          {buttonProps.icon}
          {buttonProps.text}
        </span>
      ))}

      <button
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-main-200 shadow-sm focus:relative hover:text-white hover:bg-main-200"
        onClick={props.primaryButton.onClick}
      >
        {props.primaryButton.icon}
        {props.primaryButton.text}
      </button>
    </div>
  );
};

export default ButtonGroup;
