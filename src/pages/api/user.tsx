import {NextApiRequest, NextApiResponse} from "next";
import {Investor} from "@prisma/client";
import {getAllInvestors} from "@/lib/InvestorService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "GET":
            const investors: Investor[] = await getAllInvestors();
            res.status(201).json(investors);
            break;

        case "POST":

            break;

        case "PUT":

            break;

        case "DELETE":

            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}