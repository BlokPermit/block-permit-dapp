import { ArtifactType, getContractArtifact, getErrorReason } from "@/utils/BlockchainUtils";
import { provider } from "@/utils/EthereumClient";
import { Contract } from "ethers";

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
