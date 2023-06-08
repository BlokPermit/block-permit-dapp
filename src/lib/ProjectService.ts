import { prisma } from "@/utils/PrismaClient";
import { Project, User } from "@prisma/client";
import { Contract, ContractFactory } from "ethers";
import { ArtifactType, getContractArtifact } from "@/utils/BlockchainUtils";
import { provider } from "@/utils/EthereumClient";
import { ProjectState } from ".prisma/client";

import { findUserByAddress } from "./UserService";
import { DocumentContractModel } from "../models/DocumentContractModel";
import { AddressZero } from "@ethersproject/constants";
import { getErrorReason } from "../utils/BlockchainUtils";

/*const URL: string = process.env.BACKEND_URL;

async function getContract(contractAddress: string, signer: string): Promise<Contract> {
    if (isAuthorized(signer)) {
        try {
            return new Contract(address, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, await ethers.getSigner(signer));
        } catch (error: Error) {
            throw error;
        }
    } else {
        throw new Error("User not authorized");
    }
}*/

export const createProject = async (data: Project, walletAddress: string, dppHash: string | null, dppUrl: string | null) => {
  try {
    const contractArtifact: any = getContractArtifact(ArtifactType.PROJECT_ARTIFACT);
    // Deploys a new Project smart contract on a blockchain
    const contractFactory: ContractFactory = new ContractFactory(contractArtifact.abi, contractArtifact.bytecode, await provider.getSigner(walletAddress));

    const contract: Contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`Project contract with address ${contract.address} deployed`);

    // Inserts Project and links it within User
    data.smartContractAddress = contract.address;
    data.createdAt = parseInt(await contract.dateCreated());
    let project: Project = await prisma.project.create({
      data: data,
    });

    await prisma.user.update({
      where: { walletAddress: walletAddress },
      data: {
        projectAddresses: {
          push: contract.address,
        },
      },
    });

    return project;
  } catch (error: Error | any) {
    console.log(error.message);
    throw new Error("Something went wrong in ProjectService.ts");
  }
};

export const findBaseProjectById = async (id: string): Promise<Project> => {
  try {
    const baseProject = await prisma.project.findFirst({
      where: {
        id: id,
      },
    });

    if (baseProject) return baseProject!;

    throw new Error("Project not found");
  } catch (error: any) {
    throw error;
  }
};

export const findProjectById = async (id: string) => {
  try {
    // Queries DB
    const baseProject: Project | null = await prisma.project.findFirst({
      where: {
        id: id,
      },
      include: {
        investors: true,
      },
    });

    if (!baseProject) throw new Error("Project not found");

    // Queries blockchain
    const projectContract = new Contract(baseProject.smartContractAddress, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, provider);

    const projectManager: User | null = await findUserByAddress(await projectContract.projectManager());

    let assessmentProviders: User[] = [];
    for (const address of await projectContract.getAssessmentProvidersAddresses()) {
      let user: User | null = await findUserByAddress(address);
      if (user) assessmentProviders.push(user);
    }

    const numOfAssessmentProviders: number = parseInt(await projectContract.numOfAssessmentProviders());

    let administrativeAuthority: User | null = null;
    const administrativeAuthorityAddress: string = await projectContract.administrativeAuthority();
    if (administrativeAuthorityAddress != AddressZero) {
      administrativeAuthority = await findUserByAddress(administrativeAuthorityAddress);
      console.log(administrativeAuthority);
    }

    const DPP = await projectContract.DPP();
    const DPPUrl: string | null = DPP.id != "" ? DPP.id : null;

    const sentDPPs: DocumentContractModel[] = await getDocumentContractModels(await projectContract.getSentDPPsAddresses());

    const numOfAssessedDPPs: number = parseInt(await projectContract.numOfAssessedDPPs());

    const DGD = await projectContract.DGD();
    const DGDUrl: string | null = DGD.id != "" ? DGD.id : null;

    const sentDGDs: DocumentContractModel[] | null = await getDocumentContractModels(await projectContract.getSentDGDsAddresses());

    const numOfAssessedDGDs: number = parseInt(await projectContract.numOfAssessedDGDs());

    return {
      baseProject: baseProject,
      projectManager: projectManager!,
      assessmentProviders: assessmentProviders,
      numOfAssessmentProviders: numOfAssessmentProviders,
      administrativeAuthority: administrativeAuthority,
      DPPUrl: DPPUrl,
      sentDPPs: sentDPPs,
      numOfAssessedDPPs: numOfAssessedDPPs,
      DGDUrl: DGDUrl,
      sentDGDs: sentDGDs,
      numOfAssessedDGDs: numOfAssessedDGDs,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllProjectsFromDatabase = async (userAddress: string): Promise<Project[]> => {
  try {
    // TODO: query only logged in user's projects
    /*console.log("userAddress:::", userAddress);
        let user: User = await getProjectAddressesOfUser(userAddress);
        console.log("user.projectAddresses:::", user.projectAddresses);
        let projects: Project[] = await prisma.project.findMany({
            where: {
                smartContractAddress: {
                    in: user.projectAddresses
                }
            }
        });*/
    return await prisma.project.findMany({});
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRecentProjects = async (projectIds: string[]) => {
  try {
    return await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateProject = async (project: Project) => {
  try {
    const { id, ...updatedProject } = project;
    return await prisma.project.update({
      where: {
        id: id,
      },
      data: updatedProject,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRecentProjectsByState = async (state: ProjectState) => {
  try {
    let projects: Project[] = await prisma.project.findMany({
      where: {
        projectState: state,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    if (projects.length == 0) return [];
    return projects;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addAssessmentProviders = async (projectAddress: string, signerAddress: string, assessmentProvidersAddresses: string[]) => {
  try {
    const projectContract = new Contract(projectAddress, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, await provider.getSigner(signerAddress));
    await projectContract.addAssessmentProviders(assessmentProvidersAddresses);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }

  try {
    for (let assessmentProviderAddress of assessmentProvidersAddresses) {
      await prisma.user.update({
        where: { walletAddress: assessmentProviderAddress },
        data: {
          projectAddresses: {
            push: projectAddress,
          },
        },
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const setDPP = async (projectAddress: string, signerAddress: string, dppUrl: string, dppHash: string) => {
  try {
    const projectContract = new Contract(projectAddress, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, await provider.getSigner(signerAddress));

    const dpp = {
      id: dppUrl,
      owner: signerAddress,
      documentHash: dppHash,
    };

    await projectContract.setDPP(dpp);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

export const sendDPP = async (projectAddress: string, signerAddress: string, documentContractStructs: object[]) => {
  try {
    const projectContract = new Contract(projectAddress, getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, await provider.getSigner(signerAddress));

    await projectContract.sendDPP(documentContractStructs);
  } catch (error: any) {
    throw new Error(getErrorReason(error));
  }
};

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
}

const getProjectAddressesOfUser = async (walletAddress: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

//TODO: refactor
const getDocumentContractModels = async (addresses: string[]) => {
  let sentDocumentContracts: DocumentContractModel[] = [];
  for (const address of addresses) {
    const documentContract = new Contract(address, getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi, provider);

    const assessmentProvider: User | null = await findUserByAddress(await documentContract.assessmentProvider());

    if (!assessmentProvider) throw new Error("Assessment provider not found");

    let requestedAssessmentDueDate: number | null = parseInt(await documentContract.requestedAssessmentDueDate());
    if (requestedAssessmentDueDate == 0) requestedAssessmentDueDate = null;

    sentDocumentContracts.push({
      documentContractAddress: address,
      assessmentProvider: assessmentProvider,
      isClosed: await documentContract.isClosed(),
      assessmentDueDate: parseInt(await documentContract.assessmentDueDate()),
      mainDocumentUpdateRequested: await documentContract.mainDocumentUpdateRequested(),
      requestedAssessmentDueDate: requestedAssessmentDueDate,
      attachments: getAttachmentsUrls(await documentContract.getAttachments()),
      assessmentAttachments: getAttachmentsUrls(await documentContract.getAssessmentAttachments()),
    });
  }
  return sentDocumentContracts;
};

const getAttachmentsUrls = (attachments: { id: string }[]) => {
  return attachments.map((attachment) => attachment.id);
};
