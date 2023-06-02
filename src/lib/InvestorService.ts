import {prisma} from "@/utils/PrismaClient";
import {Investor} from "@prisma/client";

export const getAllInvestors = async (): Promise<Investor[]> => {
    return prisma.investor.findMany();
}

export const createInvestors = async (investors: Investor[]) => {
    return prisma.investor.createMany({
        data: investors,
        skipDuplicates: true, // Optional. If you want to skip creating records that would create a duplicate
    });
}
