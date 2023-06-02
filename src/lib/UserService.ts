import {prisma} from "@/utils/PrismaClient";
import {User} from "@prisma/client";
import {Contract} from "ethers";
import {getOwnerContract} from "@/utils/BlockchainUtils";


export const registerUser = async (data: any) => {
    return prisma.user.create({
        data: data,
    });
}

export const createUsers = async (users: User[]) => {
    return prisma.user.createMany({
        data: users,
    });
}

export const loginUser = async (address: string) => {
    try {
        return await findUserByAddress(address);
    } catch (error) {
        return error;
    }
}
export const findUserByAddress = async (address: string) => {
    return prisma.user.findFirst({
        where: {
            walletAddress: address,
        }
    });
}

export const checkUserOnBlockchain = async (address: any): Promise<boolean> => {
    console.log(address.account);
    const contract: Contract = await getOwnerContract();
    return contract.authorizedUsers(address.account);
}