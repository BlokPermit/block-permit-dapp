import { NextApiRequest, NextApiResponse } from "next";
import { finalizeProject } from "../../../lib/ProjectService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await finalizeProject(req.body.projectAddress, req.body.signerAddress);
      res.status(200).end();
    } catch (e: any) {
      console.log(e.message);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
