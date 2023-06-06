import { User } from "@prisma/client";

export interface DocumentContractModel {
    documentContractAddress: string;
    assessmentProvider: User;
    isClosed: boolean;
    assessmentDueDate: number;
    mainDocumentUpdateRequested: boolean;
    requestedAssessmentDueDate: number | null;
}