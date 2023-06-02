import { User } from "@prisma/client";
import { prisma } from "@/utils/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import {registerUser} from "@/lib/UserService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "POST":
            const user: User = await registerUser(req.body);
            res.status(201).json(user);
            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}