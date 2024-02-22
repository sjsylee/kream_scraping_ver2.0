import type { NextApiRequest, NextApiResponse } from "next";
import { get_first_data_with_kwd } from "../../lib/kream_axios";
import { log } from "console";

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
  const { token, page_num, kwd } = JSON.parse(req.body);

  try {
    const f_d = await get_first_data_with_kwd(token, page_num, kwd);
    console.log(f_d);

    res.status(200).json({ success: true, data: JSON.stringify(f_d) });
  } catch (e) {
    const error_code = e.code;
    console.log(e);

    if (error_code == "ECONNRESET") {
      res.status(200).json({ success: false, data: "ECONNRESET" });
    } else {
      if (e.response.data["message"].includes("로그아웃")) {
        res.status(200).json({ success: false, data: "logout" });
      } else {
        res.status(200).json({ success: false, data: "failed" });
      }
    }
  }
}
