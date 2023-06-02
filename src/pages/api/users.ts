import { NextApiRequest, NextApiResponse } from "next";
import { Investor, User } from "@prisma/client";
import { createUsers, registerUser } from "@/lib/UserService";
import { createInvestors, getAllInvestors } from "@/lib/InvestorService";
import { prisma } from "@/utils/PrismaClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      break;

    case "POST":
      console.log(req.body);
      const status = await createUsers(req.body);
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
