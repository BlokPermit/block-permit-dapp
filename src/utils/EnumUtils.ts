import {ProjectState} from ".prisma/client";
import {FilterProjectState} from "@/components/specific/FilterProgressBar";


export function getProjectStateName(state: ProjectState): string {
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

export function getFilterProjectStateName(state: FilterProjectState): string {
    switch (state) {
        case FilterProjectState.AQUIRING_PROJECT_CONDITIONS:
            return "Pridobivaje pogojev"
        case FilterProjectState.AQUIRING_PROJECT_OPINIONS:
            return "Pridobivanje mnenj"
        case FilterProjectState.AQUIRING_BUILDING_PERMIT:
            return "Izdaja gradbenega dovoljenja"
        case FilterProjectState.ALL:
            return "Vsi"
        default:
            return "Nedoločeno"
    }
}