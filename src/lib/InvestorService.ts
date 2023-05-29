import {prisma} from "@/util/PrismaClient";
import {Investor} from "@prisma/client";

export const getAllInvestors = async (): Promise<Investor[]> => {
    return prisma.investor.findMany();
}
