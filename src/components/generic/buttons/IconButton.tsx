import { className } from "postcss-selector-parser";

interface AltButtonProps {
  onClick?: () => void;
  text: string;
  icon: any;
  className?: string;
}
const IconButton = (props: AltButtonProps) => {
  return (
    <button className={`${props.className} inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm shadow-sm focus:relative`} onClick={props.onClick}>
      {props.icon}
      {props.text}
    </button>
  );
};

export default IconButton;
