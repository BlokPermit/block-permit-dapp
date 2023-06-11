import { NextApiRequest, NextApiResponse } from "next";
import { setDGD } from "../../../lib/ProjectService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    try {
      await setDGD(req.body.projectAddress, req.body.signerAddress, req.body.documentUrl, req.body.documentHash);
      res.status(200).end();
    } catch (e: any) {
      console.log(e.message);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
