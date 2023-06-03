import {NextApiRequest, NextApiResponse} from "next";
import {checkUserOnBlockchain} from "@/lib/UserService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "POST":
            const isAllowed: boolean = await checkUserOnBlockchain(req.body);
            console.log(isAllowed);
            if (!isAllowed) {
                res.status(401).json(isAllowed);
                break;
            }
            res.status(201).json(isAllowed);
            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}