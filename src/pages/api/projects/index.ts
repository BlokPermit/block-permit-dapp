import {Project} from "@prisma/client";
import {createProject, getRecentProjects, updateProject} from "@/lib/ProjectService";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "POST":
            console.log(req.body);
            const project: Project | Error = await createProject(req.body.projectData, req.body.walletAddress);
            res.status(201).json(project);
            break;
        case "GET":
            const projects: Project[] | Error = await getRecentProjects(req.body.projectIds, req.body.userId);
            res.status(201).json(projects);
            break;
        case "PUT":
            let updatedProject = await updateProject(req.body.project);
            res.status(201).json(updatedProject);
            break;
        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
