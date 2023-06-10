import {ProjectState} from ".prisma/client";


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