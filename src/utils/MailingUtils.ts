import { ProjectState, Project } from "@prisma/client";

export const mailInvestor = async (body) => {
    return await fetch(`/api/mailing/sendMailToInvestor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

export const mailUser = async (body) => {
    return await fetch(`/api/mailing/sendMailToUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

// PM -> AP
export const getSetMainDocumentText = (projectName: string, projectState: ProjectState) => {
    const mainDocumentName = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD";
    return `${mainDocumentName} na projektu ${projectName} je bil posodobljen.`;
}

export const getSentMainDocumentText = (projectName: string, projectState: ProjectState) => {
    const phaseText = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektnih pogojev" : "projektnega mnenja";
    return `Poslana vam je bila zahteva za pridobitev ${phaseText} na projektu ${projectName}`;
}

export const getEvaluateDueDateExtensionText = (projectName: string, confirmed: boolean) => {
    return `Vaša zahteva za podaljšanje roka ocenitve na projektu ${projectName} je bila ${confirmed ? "sprejeta" : "zavrnjena"}`;
}

// AP -> PM
export const getRequestMainDocumentUpdateText = (projectName: string, projectState: ProjectState, assessmentProviderName: string, reason: string) => {
    const mainDocumentName = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPPja" : "DGDja";
    return `Mnenjedajalec ${assessmentProviderName} je zahteval posodobitev ${mainDocumentName} na projektu ${projectName}. Razlog: ${reason}`;
}

export const getRequestAssessmentDueDateExtensionText = (projectName: string, projectState: ProjectState, assessmentProviderName: string, reason: string) => {
    const phaseText = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektnih pogojev" : "projektnega mnenja";
    return `Mnenjedajalec ${assessmentProviderName} je zaprosil za podaljšanje roka pošiljanja ${phaseText} na projektu ${projectName}. Razlog: ${reason}`;
}

export const getProvideAssessmentText = (projectName: string, projectState: ProjectState, assessmentProviderName: string) => {
    const phaseText = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "projektne pogoje" : "projektno mnenje";
    return `Mnenjedajalec ${assessmentProviderName} je podal ${phaseText} za projekt ${projectName}.`;
}

//PM -> AA
export const getDeadlineExceededText = (projectName: string, projectState: ProjectState) => {
    const mainDocumentName = projectState == ProjectState.AQUIRING_PROJECT_CONDITIONS ? "DPP" : "DGD";
    return `${mainDocumentName} na projektu ${projectName} je bil posodobljen.`;
}