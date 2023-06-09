import { User } from "@prisma/client";

export interface DocumentContractModel {
    documentContractAddress: string;
    assessmentProvider: User;
    isClosed: boolean;
    assessmentDueDate: number;
    mainDocumentUpdateRequested: boolean;
    requestedAssessmentDueDate: number | null;
    attachments: string[] | null;
    assessmentMainDocument: string | null;
    assessmentAttachments: string[] | null;
}