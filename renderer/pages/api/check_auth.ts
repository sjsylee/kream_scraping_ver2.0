import type { NextApiRequest, NextApiResponse } from "next";
import { check_auth, ilban_req } from "../../lib/kream_axios";

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
  const { token } = JSON.parse(req.body);

  try {
    await check_auth(token);
    res.status(200).json({ success: true, data: "true" });
  } catch (e) {
    res.status(200).json({ success: false, data: "failed" });
  }
}
