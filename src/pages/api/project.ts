import { Project } from "@prisma/client";
import { prisma } from "../../util/prisma-client";

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "POST":
      const data: Project = req.body;

      const project: any = await prisma.project.create({
        data: data,
      });

      res.status(201).json(project);
      break;
    case "GET":
      res.status(200).json({ name: "John Doe" });
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
