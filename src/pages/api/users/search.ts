import {NextApiRequest, NextApiResponse} from "next";
import {findUsersByName} from "@/lib/UserService";
import {User} from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const {q} = req.query;
            const users: User[] = await findUsersByName(q as string);
            res.status(200).json({users: users})
        } catch (e: any) {
            res.status(500).json({message: e.message})
        }
    }
    res.status(405).end(`Method ${req.method} Not Allowed`);
}