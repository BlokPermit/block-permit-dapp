import { ArtifactType, getContractArtifact, getErrorReason } from "@/utils/BlockchainUtils";
import { provider } from "@/utils/EthereumClient";
import { Contract } from "ethers";
import { prisma } from "../utils/PrismaClient";
import { ProjectState } from "@prisma/client";

export const addAttachments = async (documentContractAddress: string, signerAddress: string, attachments: object[]) => {
  try {
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));

    await documentContract.addAttachments(attachments);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

export const removeAttachments = async (documentContractAddress: string, signerAddress: string, attachmentIds: string[]) => {
  try {
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await documentContract.removeAttachments(attachmentIds);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

export const evaluateAssessmentDueDateExtension = async (documentContractAddress: string, signerAddress: string, confirmed: boolean) => {
  try {
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await documentContract.evaluateAssessmentDueDateExtension(confirmed);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

export const provideAssessment = async (
  documentContractAddress: string,
  signerAddress: string,
  assessment: {
    assessmentMainDocument: { id: number; owner: string; documentHash: string };
    assessmentAttachments: { id: number; owner: string; documentHash: string }[];
    dateProvided: number;
  }
) => {
  let projectAddress: string = "";
  let numOfAssessedDGDs: number = 0;
  let numOfAssessmentProviders: number = 0;

  try {
    assessment.dateProvided = 0;
    console.log(assessment);
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await documentContract.provideAssessment(assessment, true);

    projectAddress = await documentContract.project();
    const projectContract = new Contract(projectAddress, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    numOfAssessedDGDs = parseInt(await projectContract.numOfAssessedDGDs());
    numOfAssessmentProviders = parseInt(await projectContract.numOfAssessmentProviders());
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
  try {
    if (numOfAssessedDGDs == numOfAssessmentProviders) {
      await prisma.project.update({
        where: { smartContractAddress: projectAddress },
        data: {
          projectState: ProjectState.AQUIRING_BUILDING_PERMIT,
        },
      });
    }
  } catch (e: any) {
    throw e;
  }
};

export const requestAssessmentDueDateExtension = async (documentContractAddress: string, signerAddress: string, requestedDueDate: Date) => {
  try {
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await documentContract.requestAssessmentDueDateExtension(Math.floor(requestedDueDate.getTime() / 1000));
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

export const requestMainDocumentUpdate = async (documentContractAddress: string, signerAddress: string) => {
  try {
    const documentContract = new Contract(documentContractAddress, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await documentContract.requestMainDocumentUpdate();
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};
