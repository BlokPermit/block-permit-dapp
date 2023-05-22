import { Project } from "@prisma/client";
import { prisma } from "../../util/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { saveDocument } from "@/lib/DocumentService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      const data = req.body;

      const project = await prisma.project.create({
        data: data,
      });

      res.status(201).json(project);
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
