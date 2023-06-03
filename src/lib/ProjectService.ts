import {prisma} from "@/utils/PrismaClient";
import {Project} from "@prisma/client";
import {Contract, ContractFactory} from "ethers";
import {ArtifactType, getContractABI, getContractArtifact} from "@/utils/BlockchainUtils";
import {provider} from "@/utils/EthereumClient";

const {ethers} = require("ethers");
const querystring = require("node:querystring");

const URL: string = process.env.BACKEND_URL;

async function getContract(contractAddress: string, signer: string): Promise<Contract> {
    if (isAuthorized(signer)) {
        try {
            console.log(getContractABI("Project"));
            return new Contract(address, getContractABI(ArtifactType.PROJECT_ARTIFACT), await ethers.getSigner(signer));
        } catch (error: Error) {
            throw error;
        }
    } else {
        throw new Error("User not authorized");
    }
}

export const createProject = async (data: Project, walletAddress: string) => {
    console.log(walletAddress);
    try {
        // Stores project to a database and link it to user
        let project: Project = await prisma.project.create({
            data: data,
        });

        // Deploys a new Project smart contract on a blockchain
        const contractArtifact: any = getContractArtifact(ArtifactType.PROJECT_ARTIFACT);

        const contractFactory: ContractFactory = new ContractFactory(contractArtifact.abi, contractArtifact.bytecode, await provider.getSigner(walletAddress));

        const contract: Contract = await contractFactory.deploy();
        await contract.deployed();
        console.log(`Project contract with address ${contract.address} deployed`);

        // Updates smartContractAddress on Project and links in within User
        project = await prisma.project.update({
            where: {id: project.id},
            data: {
                smartContractAddress: contract.address,
            },
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
        return await prisma.project.findFirst({
            where: {
                id: id,
            },
            include: {
                investors: true,
            },
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllProjects = async () => {
    try {
        return await prisma.project.findMany();
    } catch (error: any) {
        throw new Error(error.message);
    }
};
