import {NextApiRequest, NextApiResponse} from "next";
import {Investor, User} from "@prisma/client";
import {registerUser} from "@/lib/UserService";
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