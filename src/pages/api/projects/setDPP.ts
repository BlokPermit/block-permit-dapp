import {NextApiRequest, NextApiResponse} from "next";
import {findUsersByName} from "@/lib/UserService";
import {User} from "@prisma/client";
import {addAssessmentProviders, setDPP} from "../../../lib/ProjectService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            await setDPP(req.body.projectAddress, req.body.signerAddress, req.body.documentUrl, req.body.documentHash);
            res.status(200).end();
        } catch (e: any) {
            console.log(e.message);
            res.status(500).json({message: e.message})
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}