import { className } from "postcss-selector-parser";

interface AltButtonProps {
  onClick?: () => void;
  text: string;
  icon: any;
  className?: string;
}
const IconButton = (props: AltButtonProps) => {
  return (
    <span className="flex justify-end">
      <button
        className={
          props.className != null ? props.className : "inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-main-200 shadow-sm focus:relative hover:text-white hover:bg-main-200"
        }
        onClick={props.onClick}
      >
        {props.icon}
        {props.text}
      </button>
    </span>
  );
};

export default IconButton;
