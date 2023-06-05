import {prisma} from "@/utils/PrismaClient";
import {Project, User} from "@prisma/client";
import {Contract, ContractFactory} from "ethers";
import {ArtifactType, getContractArtifact} from "@/utils/BlockchainUtils";
import {provider} from "@/utils/EthereumClient";
import {ProjectState} from ".prisma/client";
import {dateFromTimestamp} from "../utils/DateUtils";
import {ProjectModel} from "../models/ProjectModel";
import {findUserByAddress} from "./UserService";
import {DocumentContractModel} from "../models/DocumentContractModel";
import {AddressZero} from "@ethersproject/constants";

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

export const createProject = async (data: Project, walletAddress: string, dppHash: string | null) => {
    console.log(walletAddress);
    try {
        // Deploys a new Project smart contract on a blockchain
        const contractFactory: ContractFactory = new ContractFactory(getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi, contractArtifact.bytecode, await provider.getSigner(walletAddress));

        const contract: Contract = await contractFactory.deploy();
        await contract.deployed();
        console.log(`Project contract with address ${contract.address} deployed`);

        if (dppHash != null) {
            await contract.connect(await provider.getSigner(walletAddress)).setDPP({
                id: data.dppUrl,
                owner: walletAddress,
                documentHash: dppHash
            });
            console.log("DPP set.");
        }

        // Inserts Project and links it within User
        data.smartContractAddress = contract.address;
        data.createdAt = dateFromTimestamp(await contract.dateCreated());
        let project: Project = await prisma.project.create({
            data: data,
        });

        await prisma.user.update({
            where: {walletAddress: walletAddress},
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

export const findProjectById = async (id: string) => {
    try {
        // Queries DB
        const baseProject: Project = await prisma.project.findFirst({
            where: {
                id: id,
            },
            include: {
                investors: true,
            },
        });

        // Queries blockchain
        const projectContract = new Contract(
            baseProject.smartContractAddress,
            getContractArtifact(ArtifactType.PROJECT_ARTIFACT).abi,
            provider
        )

        const projectManager: User = await findUserByAddress(
            await projectContract.projectManager()
        );

        let assessmentProviders: User[] = [];
        for (const address of await projectContract.getAssessmentProvidersAddresses()) {
            assessmentProviders.push(
                await findUserByAddress(address)
            );
        }

        const numOfAssessmentProviders: number = parseInt(await projectContract.numOfAssessmentProviders());

        let administrativeAuthority: User | undefined = undefined;
        const administrativeAuthorityAddress: string = await projectContract.administrativeAuthority();
        if (administrativeAuthorityAddress != AddressZero) {
            administrativeAuthority = await findUserByAddress(administrativeAuthorityAddress);
        }

        const DPP = await projectContract.DPP();
        const DPPUrl: string | undefined = DPP.id != '' ? DPP.id : undefined;

        const sentDPPs: DocumentContractModel[] | undefined =
            await projectContract.getSentDPPsLength() != 0
                ? await getDocumentContractModels(await projectContract.getSentDPPsAddresses())
                : undefined;

        const numOfAssessedDPPs: number = parseInt(await projectContract.numOfAssessedDPPs());

        const DGD = await projectContract.DGD();
        const DGDUrl: string | undefined = DGD.id != '' ? DGD.id : undefined;

        const sentDGDs: DocumentContractModel[] | undefined =
            await projectContract.getSentDGDsLength() != 0
                ? await getDocumentContractModels(await projectContract.getSentDGDsAddresses())
                : undefined;

        const numOfAssessedDGDs: number = parseInt(await projectContract.numOfAssessedDGDs());


        const project: ProjectModel = {
            baseProject: baseProject,
            projectManager: projectManager,
            assessmentProviders: assessmentProviders,
            numOfAssessmentProviders: numOfAssessmentProviders,
            administrativeAuthority: administrativeAuthority,
            DPPUrl: DPPUrl,
            sentDPPs: sentDPPs,
            numOfAssessedDPPs: numOfAssessedDPPs,
            DGDUrl: DGDUrl,
            sentDGDs: sentDGDs,
            numOfAssessedDGDs: numOfAssessedDGDs
        };

        project.baseProject.createdAt = project.baseProject.createdAt.toISOString();
        console.log(project);
        return project;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllProjects = async (userAddress: string) => {
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
        let projects: Project[] = await prisma.project.findMany({});
        return projects.map((project) => ({...project, createdAt: project.createdAt.toISOString()}));
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getRecentProjects = async (projectIds: string[]) => {
    try {
        let projects: Project[] = await prisma.project.findMany({
            where: {
                id: {
                    in: projectIds,
                },
            },
        });
        return projects.map((project: Project) => ({...project, createdAt: project.createdAt.toISOString()}));
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getRecentProjectsByState = async (state: ProjectState) => {
    try {
        let projects: Project[] = await prisma.project.findMany({
            where: {
                projectState: state
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5
        });
        if (projects.length == 0) return [];
        return projects.map((project: Project) => ({...project, createdAt: project.createdAt.toISOString()}));
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getProjectAddressesOfUser = async (walletAddress: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
    } catch (error: Error) {
        throw new Error(error.message);
    }
}

//TODO: refactor
const getDocumentContractModels = async (addresses: string[]) => {
    let sentDocumentContracts: DocumentContractModel[] = [];
    for (const address of addresses) {
        const documentContract = new Contract(
            address,
            getContractArtifact(ArtifactType.DOCUMENT_CONTRACT_ARTIFACT).abi,
            provider
        );

        const assessmentProvider: User = await findUserByAddress(
            await documentContract.assessmentProvider()
        );

        let requestedAssessmentDueDate: Date | undefined = dateFromTimestamp(
            await documentContract.requestedAssessmentDueDate()
        );
        if (requestedAssessmentDueDate == new Date(0)) requestedAssessmentDueDate = undefined;

        sentDocumentContracts.push({
            documentContractAddress: address,
            assessmentProvider: assessmentProvider,
            isClosed: await documentContract.isClosed(),
            assessmentDueDate: dateFromTimestamp(await documentContract.assessmentDueDate()),
            mainDocumentUpdateRequested: await documentContract.mainDocumentUpdateRequested(),
            requestedAssessmentDueDate: requestedAssessmentDueDate
        });
    }
    return sentDocumentContracts;
}
