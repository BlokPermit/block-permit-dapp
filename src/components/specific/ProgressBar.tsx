import { ProjectState } from "@prisma/client";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface ProgressBarProps {
  actualState: ProjectState;
  selectedState: ProjectState;
  handleStateChange: (state: ProjectState) => void;
  className?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  const projectStateArray = Object.values(ProjectState);

  return (
    <div className={`${props.className}`}>
      <div>
        <ol className="grid grid-cols-1 divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 text-sm text-gray-500 bg-white sm:grid-cols-3">
          {projectStateArray.map((state, index) => (
            <>
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
                  <strong className="block font-medium text-black"> Phase {index + 1} </strong>
                  <small className="mt-1"> {state} </small>
                </p>
                <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-tr-sm bg-inherit"></span>
              </li>
            </>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ProgressBar;
