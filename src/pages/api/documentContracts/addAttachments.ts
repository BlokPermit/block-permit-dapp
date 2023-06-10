import { NextApiRequest, NextApiResponse } from "next";
import { addAttachments } from "../../../lib/DocumentContractService";

//TODO: move to api/documentContracts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      console.log(req.body.confirmed);
      await addAttachments(req.body.documentContractAddress, req.body.signerAddress, req.body.attachments);
      res.status(200).end();
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
