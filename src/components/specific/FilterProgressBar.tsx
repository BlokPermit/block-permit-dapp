import {FaCheckCircle} from "react-icons/fa";
import {getFilterProjectStateName} from "@/utils/EnumUtils";

interface ProgressBarProps {
    actualState: FilterProjectState;
    selectedState: FilterProjectState;
    handleStateChange: (state: FilterProjectState) => void;
    className?: string;
    hideLastPhase?: boolean;
}

export enum FilterProjectState {
    ALL = "ALL",
    AQUIRING_PROJECT_CONDITIONS = "AQUIRING_PROJECT_CONDITIONS",
    AQUIRING_PROJECT_OPINIONS = "AQUIRING_PROJECT_OPINIONS",
    AQUIRING_BUILDING_PERMIT = "AQUIRING_BUILDING_PERMIT"
}

const ProgressBar = (props: ProgressBarProps) => {
    let projectStateArray = Object.values(FilterProjectState).slice(0, Object.values(FilterProjectState).length);

    return (
        <div className={`${props.className}`}>
            <div>
                <ol className={`grid ${props.hideLastPhase ? "grid-cols-2" : "grid-cols-4"} divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 text-sm text-gray-500 bg-white`}>
                    {projectStateArray.map((state, index) => (
                        <div key={index}>
                            <li
                                className={`z-10 relative h-full flex items-center justify-center gap-2 p-4 ${"hover:cursor-pointer hover:bg-gray-100"} ${
                                    props.selectedState === state && "bg-gray-100"
                                }`}
                                onClick={() => {
                                    props.handleStateChange(state);
                                }}
                            >
                                <FaCheckCircle className="hover:cursor-pointer"
                                               color={props.selectedState === state ? "#E88777" : "rgba(128, 128, 128, 0.8)"}
                                               size={22}/>
                                <p className="leading-none">
                                    {(index == 0) ?
                                        <strong className="block font-medium text-black"> Vsi </strong> : null}
                                    {(index >= 1) ?
                                        <strong className="block font-medium text-black"> Faza {index} </strong> : null}
                                    {(index >= 1) ?
                                        <small className="mt-1"> {getFilterProjectStateName(state)} </small> : null}
                                </p>
                                <span
                                    className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-tr-sm bg-inherit"></span>
                            </li>
                        </div>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default ProgressBar;
