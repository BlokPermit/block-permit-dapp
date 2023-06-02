import { use, useState } from "react";
import { FaCheckCircle, FaClock, FaRegClock, FaTimes } from "react-icons/fa";

interface ProgressBarProps {
  actualPhase: number;
  selectedPhase: number;
  handlePhaseChange: (phase: number) => void;
  className?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  return (
    <div className={`${props.className}`}>
      <div>
        <ol className="grid grid-cols-1 divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-200 text-sm text-gray-500 bg-white sm:grid-cols-3">
          <li
            className={`z-10 relative flex items-center justify-center gap-2 p-4 ${props.actualPhase >= 1 && "hover:cursor-pointer hover:bg-gray-100"} ${props.selectedPhase === 1 && "bg-gray-100"}`}
            onClick={() => {
              if (props.actualPhase >= 1) props.handlePhaseChange(1);
            }}
          >
            {props.actualPhase >= 2 ? (
              <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 1 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} />
            ) : (
              <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
            )}

            <p className="leading-none">
              <strong className="block font-medium text-black"> Prva faza </strong>
              <small className="mt-1"> Pridobivanje projektnih pogojev. </small>
            </p>
            <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-tr-sm bg-inherit"></span>
          </li>

          <li
            className={`z-1 relative flex items-center justify-center gap-2 p-4 ${props.actualPhase >= 2 && "hover:cursor-pointer hover:bg-gray-100"} ${props.selectedPhase === 2 && "bg-gray-100"}`}
            onClick={() => {
              if (props.actualPhase >= 2) props.handlePhaseChange(2);
            }}
          >
            {props.actualPhase >= 2 ? (
              <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 2 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} />
            ) : (
              <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
            )}

            <p className="leading-none">
              <strong className="block font-medium text-black"> Druga faza </strong>
              <small className="mt-1"> Pridobivanje projektnih mnenj. </small>
            </p>
            <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-tr-sm bg-inherit"></div>
          </li>

          <li
            className={`flex items-center justify-center gap-2 p-4 ${props.actualPhase === 3 && "hover:cursor-pointer hover:bg-gray-100"} ${props.selectedPhase === 3 && "bg-gray-100"}`}
            onClick={() => {
              if (props.actualPhase === 3) props.handlePhaseChange(3);
            }}
          >
            {props.actualPhase === 3 ? (
              <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 3 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} />
            ) : (
              <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
            )}

            <p className="leading-none">
              <strong className="block font-medium text-black"> Tretja faza </strong>
              <small className="mt-1"> Izdaja gradbenega dovoljenja. </small>
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
  // <div>
  //   <div className="after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
  //     <ol className="grid grid-cols-3 text-sm font-medium">
  //       <li className="relative flex justify-start">
  //         <span className={`absolute -bottom-[1.75rem] start-0 rounded-full`}>
  //           {props.actualPhase >= 1 ? (
  //             <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 1 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} onClick={() => props.handlePhaseChange(1)} />
  //           ) : (
  //             <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
  //           )}
  //         </span>
  //         <span> DPP Phase </span>
  //       </li>

  //       <li className="relative flex justify-center">
  //         <span className="absolute -bottom-[1.75rem] left-1/2 -translate-x-1/2 rounded-full">
  //           {props.actualPhase >= 2 ? (
  //             <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 2 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} onClick={() => props.handlePhaseChange(2)} />
  //           ) : (
  //             <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
  //           )}
  //         </span>
  //         <span> DGD Phase </span>
  //       </li>

  //       <li className="relative flex justify-end">
  //         <span className="absolute -bottom-[1.75rem] end-0 rounded-full">
  //           <span>
  //             {props.actualPhase === 3 ? (
  //               <FaCheckCircle className="hover:cursor-pointer" color={props.selectedPhase === 3 ? "#E88777" : "rgba(128, 128, 128, 0.8)"} size={22} onClick={() => props.handlePhaseChange(3)} />
  //             ) : (
  //               <FaClock color={"rgba(128, 128, 128, 0.8)"} size={22} />
  //             )}
  //           </span>
  //         </span>
  //         <span> Final Phase </span>
  //       </li>
  //     </ol>
  //   </div>
  // </div>
  // );
};

export default ProgressBar;
