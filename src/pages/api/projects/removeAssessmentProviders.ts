import { NextApiRequest, NextApiResponse } from "next";
import { removeAssessmentProviders } from "../../../lib/ProjectService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await removeAssessmentProviders(req.body.projectAddress, req.body.signerAddress, req.body.assessmentProvidersAddresses);
      res.status(200).end();
    } catch (e: any) {
      console.log(e.message);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
