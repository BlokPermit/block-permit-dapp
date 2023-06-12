import { NextApiRequest, NextApiResponse } from "next";
import { requestMainDocumentUpdate } from "../../../lib/DocumentContractService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      console.log("requestMainDocumentUpdate");
      await requestMainDocumentUpdate(req.body.documentContractAddress, req.body.signerAddress);
      res.status(200).end();
    } catch (e: any) {
      console.log(e.message);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
