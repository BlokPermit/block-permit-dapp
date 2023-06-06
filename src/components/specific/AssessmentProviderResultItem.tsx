import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

interface ResultItemProps {
  user: User;
  handleSelect: (user: User, action: "add" | "remove") => void;
  isAdded?: boolean;
}

const AssessmentProviderResultItem = (props: ResultItemProps) => {
  const [isAdded, setIsAdded] = useState<boolean>(false);
  useEffect(() => {
    setIsAdded(props.isAdded ?? false);
  });
  const handleSelect = () => {
    if (isAdded) {
      setIsAdded(false);
      props.handleSelect(props.user, "remove");
    } else {
      setIsAdded(true);
      props.handleSelect(props.user, "add");
    }
  };
  return (
    <div className={`p-5 m-3 rounded-md hover:bg-gray-200 hover:cursor-pointer border-b border-gray-200 ${isAdded && "bg-gray-200"}`} key={props.user.id} onClick={handleSelect}>
      <span className="text-lg inline-flex items-center gap-5 mb-3">
        <div>{props.user.name}</div>
        <span>{isAdded && <FaCheck color="green" />}</span>
      </span>
      <div className="text-sm text-gray-500 grid grid-cols-3 gap-20">
        <span>{props.user.streetAddress}</span>
        <span>{props.user.email}</span>
        <span>{props.user.phone}</span>
      </div>
    </div>
  );
};

export default AssessmentProviderResultItem;
