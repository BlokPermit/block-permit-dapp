import {Project} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {createProject} from "@/lib/ProjectService";
import { Project } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

    switch (method) {
        case "POST":
            const project: Project = await createProject(req.body.projectData, req.body.walletAddress);
            res.status(201).json(project);
            break;
        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
