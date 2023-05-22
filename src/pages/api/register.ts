import { User } from "@prisma/client";
import { prisma } from "@/util/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case "POST":
            const data: any = req.body;

            const user: User = await prisma.user.create({
                data: data,
            });

            res.status(201).json(user);
            break;
        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}