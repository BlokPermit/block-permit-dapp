import { useEffect } from "react";
import { FaArrowUp, FaCheck } from "react-icons/fa";

interface IconBadgeProps {
  icon: any;
  text: string;
  badgeType: "success" | "warning" | "danger" | "info";
}

const IconBadge = (props: IconBadgeProps) => {
  let [textColor, backgroundColor] = ["bg-green-100", "text-green-700"];

  useEffect(() => {
    switch (props.badgeType) {
      case "success":
        [textColor, backgroundColor] = ["bg-green-100", "text-green-700"];
        break;
      case "warning":
        [textColor, backgroundColor] = ["bg-yellow-100", "text-yellow-700"];
        break;
      case "danger":
        [textColor, backgroundColor] = ["bg-red-100", "text-red-700"];
        break;
      case "info":
        [textColor, backgroundColor] = ["bg-blue-100", "text-blue-700"];
        break;
      default:
        [textColor, backgroundColor] = ["bg-green-100", "text-green-700"];
        break;
    }
  }, [props.badgeType]);

  return (
    <span className={textColor + backgroundColor}>
      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ">
        <span className="ms-1 me-1.5">{props.icon}</span>
        <span className="me-1">{props.text}</span>
      </span>
    </span>
  );
};

export default IconBadge;
