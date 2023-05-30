import {NextApiRequest, NextApiResponse} from "next";
import {saveDocument} from "@/lib/DocumentService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "POST":
            const filePath: string = await saveDocument(req.body);
            console.log()
            res.status(201).json(filePath);
            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}









