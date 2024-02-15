import axios from "axios";
import { log, time } from "console";
import { dataArray } from "../utils/sample-api";

const DEVICE_IDS = [
  "web;f4384a74-2407-413f-9a44-bd73e758cbed",
  "web;fe697138-677f-43aa-96e5-20587052e56c",
  "web;84d0153f-dc09-4cc8-8b74-8db9ddd0e284",
];

const kream_api = () => {
  let today = new Date();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();
  let hour: string | number = today.getHours();
  let minute: string | number = today.getMinutes();
  let second: string | number = today.getSeconds();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;

  return {
    "X-Kream-Api-Version": "28",
    "X-Kream-Client-Datetime": `${today.getFullYear()}${month}${day}${hour}${minute}${second}+0900`,
    "X-Kream-Web-Build-Version": "5.1.1",
    "X-Kream-Device-Id":
      DEVICE_IDS[Math.floor(Math.random() * DEVICE_IDS.length)],
  };
};

export async function login(id: string, pswd: string) {
  const r_q = await get_new_rq_key();
  const login_url = `https://kream.co.kr/api/auth/login?request_key=${r_q}`;
  const data = {
    email: id,
    password: pswd,
  };
  const kream_api_headers = kream_api();

  const result = await axios.post(login_url, JSON.stringify(data), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "Content-Type": `application/json`,
      ...kream_api_headers,
      Referer: "https://kream.co.kr/login",
    },
  });
  const access_token = result.data["access_token"];
  console.log(access_token);

  return access_token;
}

export async function ilban_req(
  token: string,
  product_id: string,
  opt: string,
  price: number
) {
  const no_url = "https://kream.co.kr/api/m/asks";

  const r_q = await get_new_rq_key();
  const kream_api_headers = kream_api();
  // ------------------------------ 배송 주소 추출 ---------------------------------------
  const ship_result = await axios.get(
    `https://kream.co.kr/api/users/me?request_key=${r_q}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        ...kream_api_headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const shipping_address = ship_result.data["shipping_address"]["id"];
  console.log(opt);

  // ------------------------------ 일반 입찰 ---------------------------------------
  const no_result = await axios.post(
    no_url,
    JSON.stringify({
      expires_in: 30,
      is_instant: false,
      product_id: product_id,
      option: opt.toString(),
      price: price,
      shipping_address_id: shipping_address,
      receipt_config_id: null,
      request_key: r_q,
      is_keep_on_deferred: false,
      shipping_memo: {
        ask_id: null,
        bid_id: null,
        is_default: true,
        shipping_memo_type: 0,
        description: "요청사항 없음",
        preset_display_type: "selectable",
        view_type_validation: {},
      },
    }),
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        ...kream_api_headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Referer: `https://kream.co.kr/sell/${product_id}?size=${opt}`,
      },
    }
  );

  return no_result.data;
}

async function get_new_rq_key() {
  const r = await axios.get("https://kream.co.kr", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  });
  const cookie_list = r.headers["set-cookie"];
  const did = cookie_list.filter((r) => r.includes("did"))[0];
  const f_did = did.split("=")[1].split(";")[0];
  return f_did;
}

export async function check_auth(token: string) {
  const r_q = await get_new_rq_key();
  const kream_api_headers = kream_api();
  await axios.get(`https://kream.co.kr/api/users/me?request_key=${r_q}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      ...kream_api_headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return;
}

export async function get_first_data(
  token: string,
  page_num: number,
  search_type: string
) {
  const r_q = await get_new_rq_key();
  const kream_api_headers = kream_api();

  const t_url = `https://kream.co.kr/api/p/tabs/all`;

  const params = {
    request_key: r_q,
  };

  const f_result = await axios.get(t_url, {
    params: params,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "Content-Type": `application/json`,
      ...kream_api_headers,
      Referer: "https://kream.co.kr/search",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(f_result);

  const f_items = f_result.data["items"];

  const f_r_d = f_items.map((d) => {
    const prd_d = d["product"];

    try {
      return {
        상품명: prd_d["release"]["translated_name"],
        상품번호: prd_d["release"]["id"],
        링크: `https://kream.co.kr/products/${prd_d["release"]["id"]}`,
        모델명: prd_d["release"]["style_code"],
        컬러: prd_d["release"]["colorway"],
        사이즈: "",
        평균가_30개: "",
        평균가_50개: "",
        "수집범위/날짜범위_30개": "",
        "수집범위/날짜범위_50개": "",
        최저_보판가: "",
        최저_95점_보판가: "",
        최저_일판가: "",
        즉시_판매가: "",
      };
    } catch {
      return null;
    }
  });
  return f_r_d.filter((d) => d !== null);
}

export async function get_final_data(token: string, product_id: string) {
  const r_q = await get_new_rq_key();
  const kream_api_headers = kream_api();

  const t_url = `https://kream.co.kr/api/p/products/${product_id}?request_key=${r_q}`;

  const res = await axios.get(t_url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      ...kream_api_headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const sales_options = res.data["sales_options"];

  if (!sales_options) {
    return [
      {
        사이즈: "X",
        최저_보판가: "X",
        최저_95점_보판가: "X",
        최저_일판가: "X",
        즉시_판매가: "X",
      },
    ];
  }

  let return_data = [];

  for (let d of sales_options) {
    let extra_dat = await get_option_sales_data(token, product_id, d["option"]);

    const today = new Date();

    let mean30: number | null;
    let mean50: number | null;
    let numDate30: number | null;
    let numDate50: number | null;

    if (extra_dat.length === 0) {
    } else if (
      Math.ceil(
        Math.abs(
          (today as any) - (new Date(extra_dat[0]["date_created"]) as any)
        ) /
          (1000 * 60 * 60 * 24)
      ) > 30
    ) {
    } else {
      if (extra_dat.length >= 30) {
        const prices_30 = extra_dat.filter((d, i) => i < 30);
        mean30 = Math.round(
          prices_30.reduce((total, next) => total + next["price"], 0) /
            prices_30.length
        );
        const diff_30 = Math.ceil(
          Math.abs(
            (today as any) - (new Date(extra_dat[29]["date_created"]) as any)
          ) /
            (1000 * 60 * 60 * 24)
        );
        numDate30 = 30 / diff_30;
      }

      if (extra_dat.length >= 70) {
        const prices_70 = extra_dat.filter((d, i) => i < 50);
        mean50 = Math.round(
          prices_70.reduce((total, next) => total + next["price"], 0) /
            prices_70.length
        );
        const diff_50 = Math.ceil(
          Math.abs(
            (today as any) - (new Date(extra_dat[49]["date_created"]) as any)
          ) /
            (1000 * 60 * 60 * 24)
        );
        numDate50 = 50 / diff_50;
      }
    }

    return_data.push({
      사이즈: d["option"],
      평균가_30개: mean30,
      평균가_50개: mean50,
      "수집범위/날짜범위_30개": numDate30,
      "수집범위/날짜범위_50개": numDate50,
      최저_보판가: d["lowest_100"],
      최저_95점_보판가: d["lowest_95"],
      최저_일판가: d["lowest_normal"],
      즉시_판매가: d["highest_bid"],
    });

    await sleep(2000);
  }

  return return_data;
}

export async function get_option_sales_data(
  token: string,
  product_id: string,
  option: number
) {
  const total = [];

  const r_q = await get_new_rq_key();
  const kream_api_headers = kream_api();

  const t_url = `https://kream.co.kr/api/p/products/${product_id}/${option}/sales`;

  let go = true;

  for (let i = 1; i < 2; i++) {
    console.log(i);

    const params = {
      cursor: i,
      per_page: 70,
      sort: "date_created[desc]",
      request_key: r_q,
    };
    while (true) {
      try {
        const f_result = await axios.get(t_url, {
          params: params,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Content-Type": `application/json`,
            ...kream_api_headers,
            Referer: `https://kream.co.kr/products/${product_id}`,
            Authorization: `Bearer ${token}`,
          },
        });

        const f_items = f_result.data["items"];
        total.push(...f_items);
        await sleep(1000);

        break;
      } catch (e) {
        try {
          if (e.response.data["message"].includes("was not found")) {
            console.log(e.response.statusText);
            go = false;
            break;
          }

          if (e.response.statusText.includes("MANY")) {
            console.log(e.response.statusText);
            console.log("1분 대기...");

            await sleep(60000);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    await sleep(2000);

    if (!go) {
      break;
    }
  }
  return total;
}

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));