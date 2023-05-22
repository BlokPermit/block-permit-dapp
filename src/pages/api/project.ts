import { Project } from "@prisma/client";
import { prisma } from "@/util/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      const data: any = req.body;

      const project: Project = await prisma.project.create({
        data: data,
      });

      res.status(201).json(project);
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
