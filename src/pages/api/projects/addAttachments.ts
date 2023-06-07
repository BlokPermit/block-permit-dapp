import {NextApiRequest, NextApiResponse} from "next";
import {addAssessmentProviders, addAttachments} from "../../../lib/ProjectService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            await addAttachments(req.body.documentContractAddress, req.body.signerAddress, req.body.attachments);
            res.status(200).end();
        } catch (e: any) {
            console.log(e.message);
            res.status(500).json({message: e.message})
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}