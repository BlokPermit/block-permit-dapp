import {prisma} from "@/util/PrismaClient";

export const createProject = async (data: any) => {
    return prisma.project.create({
        data: data,
    });
}
export const findProjectById = async (id: number) => {
    return prisma.project.findFirst({
        where: {
            id: id,
        }
    });
}