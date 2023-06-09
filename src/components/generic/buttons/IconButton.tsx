import { className } from "postcss-selector-parser";
import { useEffect, useState } from "react";

interface AltButtonProps {
  onClick?: () => void;
  text: string;
  icon: any;
  className?: string;
  disabled?: boolean;
}
const IconButton = (props: AltButtonProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(props.disabled || false);
  }, [props.disabled]);

  return (
    <button disabled={isButtonDisabled} className={`${props.className} border-2 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm focus:relative`} onClick={props.onClick}>
      {props.icon}
      {props.text}
    </button>
  );
};

export default IconButton;
