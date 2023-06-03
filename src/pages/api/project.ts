import {Project} from "@prisma/client";
import {createProject} from "@/lib/ProjectService";
import {NextApiRequest, NextApiResponse} from "next";
import {getContractArtifact} from "../../utils/BlockchainUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "POST":
            console.log(req.body);
            const project: Project | Error = await createProject(req.body.projectData, req.body.walletAddress, req.body.dppHash);
            res.status(201).json(project);
            break;
        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
