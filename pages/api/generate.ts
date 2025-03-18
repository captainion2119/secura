import { NextApiRequest, NextApiResponse } from "next";
import handler from "@/backend/generate"; // ✅ Import the function correctly

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res); // ✅ Pass both req and res
}
