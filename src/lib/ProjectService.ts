import {prisma} from "@/utils/PrismaClient";
import {Project} from "@prisma/client";
import {Contract, ContractFactory} from "ethers";
import {ArtifactType, getContractArtifact} from "@/utils/BlockchainUtils";
import {provider} from "@/utils/EthereumClient";
import {ProjectState} from ".prisma/client";

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
        const contractArtifact: any = getContractArtifact(ArtifactType.PROJECT_ARTIFACT);

        const contractFactory: ContractFactory = new ContractFactory(contractArtifact.abi, contractArtifact.bytecode, await provider.getSigner(walletAddress));

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

        // Updates smartContractAddress on Project and links in within User
        data.smartContractAddress = contract.address;
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
        //data.smartContractAddress = contract.address;
        return project;
    } catch (error: Error | any) {
        console.log(error.message);
        throw new Error("Something went wrong in ProjectService.ts");
    }
};

export const findProjectById = async (id: string) => {
    try {
        let project: any = await prisma.project.findFirst({
            where: {
                id: id,
            },
            include: {
                investors: true,
            },
        });
        project.createdAt = project.createdAt.toISOString();
        return project;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllProjects = async () => {
    try {
        let projects: Project[] = await prisma.project.findMany();
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
