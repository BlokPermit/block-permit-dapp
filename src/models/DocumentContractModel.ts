import { User } from "@prisma/client";

export interface DocumentContractModel {
    documentContractAddress: string;
    assessmentProvider: User;
    isClosed: boolean;
    assessmentDueDate: Date;
    mainDocumentUpdateRequested: boolean;
    requestedAssessmentDueDate: Date | null;
}