import {prisma} from "@/utils/PrismaClient";
import {User} from "@prisma/client";


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