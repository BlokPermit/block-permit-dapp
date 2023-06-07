import { FaArrowUp, FaCalendar, FaCheck, FaClock, FaEye, FaPaperclip, FaTimes } from "react-icons/all";
import ButtonGroup from "@/components/generic/buttons/ButtonGroup";
import React, { useEffect, useState } from "react";
import IconBadge from "../generic/data-view/IconBadge";
import { User } from "@prisma/client";
import { DocumentContractModel } from "@/models/DocumentContractModel";
import {dateFromTimestamp, formatDate} from "../../utils/DateUtils";

interface OpinionProviderProps {
  assessmentProvider: User;
  documentContract: DocumentContractModel;
  countSelected: (isSelected: boolean, id: string) => void;
  handleAttachments: (id: string) => void;
}

const AssessmentProviderListItem = (props: OpinionProviderProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [status, setStatus] = useState<"waiting to send" | "sent" | "assessed">("assessed");

  useEffect(() => {
    if (props.documentContract) {
      setStatus("sent");
      if (props.documentContract.isClosed) {
        setStatus("assessed");
        return;
      }
      return;
    }
    setStatus("waiting to send");
  });
  return (
    <div key={props.assessmentProvider.id} className={isSelected ? "p-4 mb-4 rounded-lg bg-gray-100 border border-gray-200" : "p-4 mb-4 rounded-lg bg-white border border-gray-200"}>
      <div className="flex justify-between">
        <div className="flex justify-between gap-5 items-center">
          <div className="text-lg">
            {status === "waiting to send" && <IconBadge icon={<FaArrowUp />} text="Waiting to Send" badgeType="info" />}
            {status === "sent" && <IconBadge icon={<FaClock />} text="Waiting for Assessment" badgeType="warning" />}
            {status === "assessed" && <IconBadge icon={<FaCheck />} text="Ready for Review" badgeType="success" />}
          </div>
          <span className="text-black">
            <div className="text-lg font-bold">{props.assessmentProvider.name}</div>
          </span>
        </div>
        <ButtonGroup
          secondaryButtons={
            status === "sent"
              ? [
                  {
                    text: formatDate(dateFromTimestamp(props.documentContract.assessmentDueDate!)),
                    icon: <FaCalendar />,
                    onClick: () => {},
                    disabled: true,
                  },
                  {
                    text: "Attachments",
                    icon: <FaPaperclip />,
                    onClick: () => props.handleAttachments(props.assessmentProvider.id),
                  },
                ]
              : [
                  {
                    text: "Attachments",
                    icon: <FaPaperclip />,
                    onClick: () => props.handleAttachments(props.assessmentProvider.id),
                  },
                ]
          }
          primaryButton={
            status === "waiting to send"
              ? {
                  text: isSelected ? "Deselect" : "Select",
                  icon: isSelected ? <FaTimes /> : <FaCheck />,
                  onClick: () => {
                    setIsSelected(!isSelected);
                    props.countSelected(!isSelected, props.assessmentProvider.id);
                  },
                }
              : {
                  text: status === "assessed" ? "Review" : "Sent",
                  icon: status === "assessed" ? <FaEye /> : <FaArrowUp />,
                  onClick: status === "assessed" ? () => {} : () => {},
                  disabled: status === "assessed" ? false : true,
                }
          }
        />
      </div>
    </div>
  );
};

export default AssessmentProviderListItem;
