import type { NextApiRequest, NextApiResponse } from "next";
import { login } from "../../lib/kream_axios";

export type ResponseData = {
  success: boolean;
  data: string | null;
};

export type Profie = {
  id: string;
  pswd: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id, pswd } = JSON.parse(req.body);

  try {
    const token = await login(id, pswd);
    res.status(200).json({ success: true, data: token });
  } catch {
    res.status(200).json({ success: false, data: "failed" });
  }
}
