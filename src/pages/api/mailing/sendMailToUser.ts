import {NextApiRequest, NextApiResponse} from "next";
import {sendMailToUser} from "../../../lib/MailingService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            await sendMailToUser(req.body.to, req.body.subject, req.body.text, req.body.link);
            res.status(200).end();
        } catch (e: any) {
            console.log(e.message);
            res.status(500).json({message: e.message})
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}