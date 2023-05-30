import { FaArrowUp, FaCheck, FaClock, FaPaperclip, FaTimes, FaTrash } from "react-icons/all";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import React, { useState } from "react";
import IconBadge from "../generic/data-view/IconBadge";

interface OpinionProviderProps {
  opinionProvider: any;
  countSelected: (isSelected: boolean, id: number) => void;
  handleAttachments: (id: number) => void;
  handleRemove: (id: number) => void;
}

const OpinionProvider = (props: OpinionProviderProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [status, setStatus] = useState<"waiting to send" | "sent" | "assessed">("assessed");

  return (
    <div className={isSelected ? "p-4 mb-4 rounded-lg bg-gray-100 border border-gray-200" : "p-4 mb-4 rounded-lg bg-white border border-gray-200"}>
      <div key={props.opinionProvider.id} className="flex justify-between">
        <div className="flex justify-between gap-5 items-center">
          <div className="text-lg">
            {status === "waiting to send" && <IconBadge icon={<FaArrowUp />} text="Waiting to Send" badgeType="info" />}
            {status === "sent" && <IconBadge icon={<FaClock />} text="Waiting for Assessment" badgeType="warning" />}
            {status === "assessed" && <IconBadge icon={<FaCheck />} text="Ready for Review" badgeType="success" />}
          </div>
          <span className="text-black">
            <div className="text-lg font-bold">{props.opinionProvider.name}</div>
          </span>
        </div>
        <ButtonGroup
          secondaryButtons={[
            {
              text: "Remove",
              icon: <FaTrash />,
              onClick: () => props.handleRemove(props.opinionProvider.id),
            },
            {
              text: "Attachments",
              icon: <FaPaperclip />,
              onClick: () => props.handleAttachments(props.opinionProvider.id),
            },
          ]}
          primaryButton={{
            text: isSelected ? "Deselect" : "Select",
            icon: isSelected ? <FaTimes /> : <FaCheck />,
            onClick: () => {
              setIsSelected(!isSelected);
              props.countSelected(!isSelected, props.opinionProvider.id);
            },
          }}
        />
      </div>
    </div>
  );
};

export default OpinionProvider;
