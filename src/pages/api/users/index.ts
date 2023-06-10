import { NextApiRequest, NextApiResponse } from "next";
import {createUsers, updateUser} from "@/lib/UserService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;

    switch (method) {
        case "GET":
            break;

        case "POST":
            const status = await createUsers(req.body);
            res.status(201).json(status);
            break;

        case "PUT":
            const response = await updateUser(req.body.user);
            res.status(201).json(response);
            break;

        case "DELETE":

            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}