import { prisma } from "@/util/PrismaClient";
import { Project } from "@prisma/client";

export const createProject = async (data: Project) => {
  return prisma.project.create({
    data: data,
  });
};
export const findProjectById = async (id: number) => {
  return prisma.project.findFirst({
    where: {
      id: id,
    },
    include: {
      investors: true,
    },
  });
};
