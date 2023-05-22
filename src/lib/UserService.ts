import {prisma} from "@/util/PrismaClient";

export const registerUser = async (data: any) => {
    return prisma.user.create({
        data: data,
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
            address: address,
        }
    });
}