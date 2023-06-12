import { NextApiRequest, NextApiResponse } from "next";
import {requestAssessmentDueDateExtension} from "../../../lib/DocumentContractService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            await requestAssessmentDueDateExtension(req.body.documentContractAddres, req.body.signerAddress, new Date(req.body.requestedDueDate));
            res.status(200).end();
        } catch (e: any) {
            console.log(e.message);
            res.status(500).json({ message: e.message });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
