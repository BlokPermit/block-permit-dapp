import { prisma } from "db/client.ts";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const data = req.body;

      const project = await prisma.project.create({
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
