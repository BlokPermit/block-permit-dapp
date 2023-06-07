import { useEffect, useState } from "react";

interface IconBadgeProps {
  icon: any;
  text: string;
  badgeType: "success" | "warning" | "danger" | "info";
}

const IconBadge = (props: IconBadgeProps) => {
  const [bgColor, setBgColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");

  useEffect(() => {
    switch (props.badgeType) {
      case "success":
        setBgColor("bg-green-100");
        setTextColor("text-green-700");
        break;
      case "warning":
        setBgColor("bg-main-200");
        setTextColor("text-white");
        break;
      case "danger":
        setBgColor("bg-red-100");
        setTextColor("text-red-700");
        break;
      case "info":
        setBgColor("bg-gray-100");
        setTextColor("text-gray-700");
        break;
      default:
        setBgColor("bg-green-100");
        setTextColor("text-green-700");
        break;
    }
  }, [props.badgeType]);

  return (
    <span className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${bgColor} ${textColor}`}>
      <span className="ms-1 me-1.5">{props.icon}</span>
      <span className="me-1">{props.text}</span>
    </span>
  );
};

export default IconBadge;
