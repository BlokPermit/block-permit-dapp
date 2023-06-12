import { ProjectState } from "@prisma/client";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { getProjectStateName } from "@/utils/EnumUtils";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  actualState: ProjectState;
  selectedState: ProjectState;
  handleStateChange: (state: ProjectState) => void;
  className?: string;
  hideLastPhase?: boolean;
}

const ProgressBar = (props: ProgressBarProps) => {
  let projectStateArray = !props.hideLastPhase ? Object.values(ProjectState) : Object.values(ProjectState).slice(0, Object.values(ProjectState).length - 1);

  return (
    <div className={`${props.className}`}>
      <div>
        <ol className={`grid ${props.hideLastPhase ? "grid-cols-2" : "grid-cols-3"} divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 text-sm text-gray-500 bg-white`}>
          {projectStateArray.map((state, index) => (
            <div key={index}>
              <li
                className={`z-10 relative flex items-center justify-center gap-2 p-4 ${projectStateArray.indexOf(props.actualState) >= index && "hover:cursor-pointer hover:bg-gray-100"} ${
                  props.selectedState === state && "bg-gray-100"
                }`}
                onClick={() => {
                  if (projectStateArray.indexOf(props.actualState) >= index) props.handleStateChange(state);
                }}
              >
                {projectStateArray.indexOf(props.actualState) >= index ? (
                  <FaCheckCircle className="hover:cursor-pointer" color={props.selectedState === state ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} />
                ) : (
                  <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
                )}

                <p className="leading-none">
                  <strong className="block font-medium text-black"> Faza {index + 1} </strong>
                  <small className="mt-1"> {getProjectStateName(state)} </small>
                </p>
                <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-tr-sm bg-inherit"></span>
              </li>
            </div>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ProgressBar;
