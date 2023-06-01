import {NextApiRequest, NextApiResponse} from "next";
import {Investor, User} from "@prisma/client";
import {registerUser} from "@/lib/UserService";
import {createInvestors, getAllInvestors} from "@/lib/InvestorService";
import {prisma} from "@/util/PrismaClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "GET":
            const investors: Investor[] = await getAllInvestors();
            res.status(201).json(investors);
            break;

        case "POST":
            const status = await createInvestors(req.body);
            res.status(201).json(status);
            break;

        case "PUT":

            break;

        case "DELETE":

            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}