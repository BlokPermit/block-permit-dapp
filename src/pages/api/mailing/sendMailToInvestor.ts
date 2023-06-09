import {NextApiRequest, NextApiResponse} from "next";
import {sendMailToInvestor} from "../../../lib/MailingService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            console.log(req.body);
            await sendMailToInvestor(req.body.to, req.body.subject, req.body.info);
            res.status(200).end();
        } catch (e: any) {
            console.log(e);
            res.status(500).json({message: e.message})
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}