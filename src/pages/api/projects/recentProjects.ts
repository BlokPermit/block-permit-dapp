import {Project} from "@prisma/client";
import {getRecentProjects} from "@/lib/ProjectService";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "POST":
            const projects = await getRecentProjects(req.body.projectIds, req.body.userId);
            res.status(201).json(projects);
            break;
        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
