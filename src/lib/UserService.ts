import {prisma} from "@/utils/PrismaClient";
import {User} from "@prisma/client";
import {Contract, ethers, Signer} from "ethers";
import {getOwnerContract} from "@/utils/BlockchainUtils";
import {provider} from "@/utils/EthereumClient";


export const createUsers = async (users: User[]) => {
    return prisma.user.createMany({
        data: users,
    });
}

export const findUserByAddress = async (address: string) => {
    return prisma.user.findFirst({
        where: {
            walletAddress: address,
        }
    });
}

export const checkUserOnBlockchain = async (address: any): Promise<boolean> => {
    const contract: Contract = await getOwnerContract();
    const isOwner: boolean = await contract.owners(address.account)
    if (isOwner) return isOwner;
    return contract.authorizedUsers(address.account);
}

export const authorizeUsersOnBlockchain = async (addresses: any, signer: string): Promise<any> => {
    console.log(signer);
    const contract: Contract = await getOwnerContract();
    console.log(contract);
    return contract.connect(provider.getSigner(signer)).authorizeUsers(addresses);
}