import React from 'react';
import {ProjectState} from ".prisma/client";
import {FaClock} from "react-icons/fa";

interface ProjectStateProps {
    state: ProjectState;
}

function ProjectStateBadge({state}: ProjectStateProps) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full bg-main-400 px-2.5 py-1  text-white  h-1/4 mt-0.5`}>
             <FaClock color="white" size={14}/>
              <p className="whitespace-nowrap text-sm pl-1.5 ">{getProjectStateName(state)}</p>
            </span>
    );
}

function getProjectStateName(state: ProjectState): string {
    switch (state) {
        case ProjectState.AQUIRING_PROJECT_CONDITIONS:
            return "Pridobivaje pogojev"
        case ProjectState.AQUIRING_PROJECT_OPINIONS:
            return "Pridobivanje mnenj"
        case ProjectState.AQUIRING_BUILDING_PERMIT:
            return "Izdaja gradbenega dovoljenja"
        default:
            return "Nedoločeno"
    }
}

export default ProjectStateBadge;