import React from "react";
import {
  LoadingOutlined,
  WarningTwoTone,
  ReloadOutlined,
  ReconciliationTwoTone,
  SearchOutlined,
  FileTextTwoTone,
  AlertTwoTone,
  FileExcelTwoTone,
  GiftFilled,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Typography,
  message,
  InputNumber,
  Popconfirm,
  Card,
  Divider,
  DatePicker,
  Select,
  Progress,
  Statistic,
} from "antd";
import { fetchJson } from "../lib/api";
import { useState } from "react";
import { useEffect } from "react";
import { exportWorksheet } from "../lib/exportToExcel";
import { log } from "console";

type RangeValue = Parameters<
  NonNullable<React.ComponentProps<typeof DatePicker.RangePicker>["onChange"]>
>[0];

const { Text } = Typography;

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export default function NextPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [token, setToken] = useState<string>();
  const [profile, setProfile] = useState();
  const [firstDat, setFirstDat] = useState<any[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [finalDat, setFinalDat] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [searchOpt, setSearchOpt] = useState<string>(
    "popularity_without_trading"
  );
  const [firstProg, setFirstProg] = useState<number>(0);
  const [secondProg, setSecondProg] = useState<number>(0);
  const [statusLabel, setStatusLabel] = useState<string>("");

  useEffect(() => {
    const c = localStorage.getItem("token");
    console.log(c);
    setToken(c);

    const p = JSON.parse(localStorage.getItem("profile"));
    console.log(p);
    setProfile(p);
  }, []);

  return (
    <>
      {contextHolder}
      <Row gutter={5} align="middle">
        <Col>
          <ReconciliationTwoTone twoToneColor="#092635" />
        </Col>
        <Col>
          <Text strong style={{ fontSize: "14px", fontFamily: "establish" }}>
            상품 정보 수집
          </Text>
        </Col>
      </Row>

      <Divider />
      <Row style={{ marginBottom: "10px" }} gutter={4} align={"middle"}>
        <Col>
          <AlertTwoTone twoToneColor="#2666CF" />
        </Col>
        <Col>
          <Text style={{ color: "#2666CF", fontSize: "12px" }}>
            상품을 가져올 페이지를 설정하여 한번 실행에 최대 50개의 상품정보를
            가져옵니다.
          </Text>
        </Col>
      </Row>
      <Row align={"middle"} gutter={8}>
        <Col>
          <Select
            defaultValue="popularity_without_trading"
            onChange={(value) => {
              setSearchOpt(value);
            }}
            style={{ width: 140 }}
            options={[
              { value: "popularity_without_trading", label: "인기순" },
              { value: "male_popularity", label: "남성 인기순" },
              { value: "female_popularity", label: "여성 인기순" },
              { value: "wish", label: "관심 많은순" },
              { value: "style_tags", label: "스타일 많은순" },
              { value: "pricepremium", label: "프리미엄 높은순" },
              { value: "pricepremium[asc]", label: "프리미엄 낮은순" },
            ]}
          />
        </Col>
        <Col>
          <InputNumber
            style={{ width: 120 }}
            min={1}
            max={99999}
            step={1}
            onChange={(value) => {
              setPageNum(value);
            }}
            value={pageNum}
            formatter={(value) => `${value} 페이지`}
            parser={(value) => +value!.replace(" 페이지", "")}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            disabled={isActive}
            icon={<SearchOutlined />}
            onClick={async () => {
              if (!token || !profile) {
                messageApi.error({
                  content: "로그인이 필요합니다!",
                  icon: <WarningTwoTone twoToneColor="#C70039" />,
                  style: { color: "#45474B" },
                });
                return;
              }
              setIsActive(true);

              let c_token = token;
              console.log(token);

              const auth_test = await fetchJson("/api/check_auth", {
                method: "POST",
                body: JSON.stringify({
                  token: c_token,
                }),
              });

              if (auth_test.data === "failed") {
                messageApi.error({
                  content: "자동 재로그인을 진행합니다...",
                  icon: <LoadingOutlined twoToneColor="#2185D5" />,
                  style: { color: "#45474B" },
                });
                const new_token = await fetchJson("/api/kream_login", {
                  method: "POST",
                  body: JSON.stringify(profile),
                });
                c_token = new_token.data;
                localStorage.setItem(`token`, c_token);
              }
              let first_total = [];
              let final_total = [];

              setFirstProg(0);
              setSecondProg(0);

              let f_r = await fetchJson("/api/get_first_data", {
                method: "POST",
                body: JSON.stringify({
                  token: c_token,
                  page_num: pageNum,
                  search_type: searchOpt,
                }),
              });

              if (f_r.data === "ECONNRESET") {
                messageApi.error({
                  content: "요청 재시도...",
                  icon: <LoadingOutlined twoToneColor="#2185D5" />,
                  style: { color: "#45474B" },
                });
              } else {
                if (f_r.data === "logout") {
                  messageApi.error({
                    content: "자동 재로그인을 진행합니다...",
                    icon: <LoadingOutlined twoToneColor="#2185D5" />,
                    style: { color: "#45474B" },
                  });
                  const new_token = await fetchJson("/api/kream_login", {
                    method: "POST",
                    body: JSON.stringify(profile),
                  });
                  c_token = new_token.data;
                  localStorage.setItem(`token`, c_token);

                  f_r = await fetchJson("/api/get_first_data", {
                    method: "POST",
                    body: JSON.stringify({
                      token: c_token,
                      page_num: pageNum,
                      search_type: searchOpt,
                    }),
                  });
                }

                first_total.push(...JSON.parse(f_r.data));
                setFirstProg((prev) => (prev += 100 / pageNum));
                // 루프 종료
              }

              setFirstDat([...first_total]);

              messageApi.success({
                content: `1차 수집 완료!`,
                icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                style: { color: "#45474B" },
              });

              // 2차 최종 요청

              let t_n = 0;
              for (let dat of first_total) {
                let is_go_2 = true;
                t_n += 1;

                while (is_go_2) {
                  let f_r_d = await fetchJson("/api/get_final_data", {
                    method: "POST",
                    body: JSON.stringify({
                      token: c_token,
                      product_id: dat["상품번호"],
                    }),
                  });

                  if (f_r_d.data === "ECONNRESET") {
                    messageApi.error({
                      content: "요청 재시도...",
                      icon: <LoadingOutlined twoToneColor="#2185D5" />,
                      style: { color: "#45474B" },
                    });
                    await sleep(500);
                  } else {
                    if (f_r_d.data === "logout") {
                      messageApi.error({
                        content: "자동 재로그인을 진행합니다...",
                        icon: <LoadingOutlined twoToneColor="#2185D5" />,
                        style: { color: "#45474B" },
                      });
                      const new_token = await fetchJson("/api/kream_login", {
                        method: "POST",
                        body: JSON.stringify(profile),
                      });
                      c_token = new_token.data;
                      localStorage.setItem(`token`, c_token);

                      f_r_d = await fetchJson("/api/get_final_data", {
                        method: "POST",
                        body: JSON.stringify({
                          token: c_token,
                          product_id: dat["상품번호"],
                        }),
                      });
                    }

                    const size_opt = JSON.parse(f_r_d.data);

                    size_opt.map((d, i) => {
                      if (i === 0) {
                        final_total.push({
                          ...dat,
                          사이즈: d["사이즈"],
                          평균가_30개: d["평균가_30개"],
                          평균가_50개: d["평균가_50개"],
                          "수집범위/날짜범위_30개": d["수집범위/날짜범위_30개"],
                          "수집범위/날짜범위_50개": d["수집범위/날짜범위_50개"],
                          최저_보판가: d["최저_보판가"],
                          최저_95점_보판가: d["최저_95점_보판가"],
                          최저_일판가: d["최저_일판가"],
                          즉시_판매가: d["즉시_판매가"],
                        });

                        if (i === size_opt.length - 1) {
                          final_total.push({
                            상품명: "",
                            상품번호: "",
                            링크: "",
                            모델명: "",
                            컬러: "",
                            사이즈: "",
                            평균가_30개: "",
                            평균가_50개: "",
                            "수집범위/날짜범위_30개": "",
                            "수집범위/날짜범위_50개": "",
                            최저_보판가: "",
                            최저_95점_보판가: "",
                            최저_일판가: "",
                            즉시_판매가: "",
                          });
                        }
                      } else {
                        final_total.push({
                          상품명: "",
                          상품번호: "",
                          링크: "",
                          모델명: "",
                          컬러: "",
                          사이즈: d["사이즈"],
                          평균가_30개: d["평균가_30개"],
                          평균가_50개: d["평균가_50개"],
                          "수집범위/날짜범위_30개": d["수집범위/날짜범위_30개"],
                          "수집범위/날짜범위_50개": d["수집범위/날짜범위_50개"],
                          최저_보판가: d["최저_보판가"],
                          최저_95점_보판가: d["최저_95점_보판가"],
                          최저_일판가: d["최저_일판가"],
                          즉시_판매가: d["즉시_판매가"],
                        });

                        if (i === size_opt.length - 1) {
                          final_total.push({
                            상품명: "",
                            상품번호: "",
                            링크: "",
                            모델명: "",
                            컬러: "",
                            사이즈: "",
                            평균가_30개: "",
                            평균가_50개: "",
                            "수집범위/날짜범위_30개": "",
                            "수집범위/날짜범위_50개": "",
                            최저_보판가: "",
                            최저_95점_보판가: "",
                            최저_일판가: "",
                            즉시_판매가: "",
                          });
                        }
                      }
                    });

                    setSecondProg((prev) => (prev += 100 / first_total.length));

                    await sleep(1500);

                    if (t_n % 500 === 0) {
                      if (t_n === first_total.length) {
                      } else {
                        setStatusLabel(
                          "IP 차단 방지를 위해 3분간 정지합니다..."
                        );
                        await sleep(180000);
                        setStatusLabel("");
                      }
                    }

                    is_go_2 = false;
                  }
                }
              }

              messageApi.success({
                content: `최종 수집 완료!`,
                icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                style: { color: "#45474B" },
              });

              setFinalDat((prev) => final_total);
              setIsActive(false);
            }}
          >
            수집 시작
          </Button>
        </Col>
        <Col>
          <Popconfirm
            title="작업 초기화"
            description="정말로 모든 작업을 초기화 하시겠습니까?"
            onConfirm={() => {
              setFirstProg(0);
              setSecondProg(0);
              setFirstDat([]);
              setFinalDat([]);
            }}
            onCancel={() => {
              return;
            }}
            okText="초기화"
            cancelText="종료"
          >
            <Button
              disabled={isActive}
              icon={<ReloadOutlined />}
              type="primary"
              style={{ color: "#E6B9DE", fontSize: "14px" }}
            >
              작업 초기화
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <Divider />
      <Card size="small" style={{ width: 740, height: 400, padding: "3px" }}>
        <Row style={{ marginBottom: "5px" }}>
          <Text style={{ fontSize: "12px", fontFamily: "establish" }}>
            진행 정보
          </Text>
        </Row>
        <Row
          style={{ marginBottom: "10px", marginTop: "10px", marginLeft: "5px" }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "LINESeedKR-Bd",
              color: "#607274",
            }}
          >
            1차 상품 정보 수집 진행률
          </Text>
        </Row>
        <Row
          style={{ marginBottom: "10px", marginTop: "10px", marginLeft: "5px" }}
        >
          <Progress
            percent={Math.round(firstProg)}
            strokeColor={{ "0%": "#87d068", "100%": "#FC6736" }}
            status={firstProg === 100 ? "success" : "active"}
          />
        </Row>
        <Row
          style={{
            marginBottom: "10px",
            marginTop: "10px",
            marginLeft: "5px",
            color: "#607274",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "LINESeedKR-Bd",
              color: "#607274",
            }}
          >
            2차 상품 정보 수집 진행률
          </Text>
        </Row>
        <Row
          style={{ marginBottom: "10px", marginTop: "10px", marginLeft: "5px" }}
        >
          <Progress
            percent={Math.round(secondProg * 100) / 100}
            strokeColor={{ "0%": "#FC6736", "100%": "#108ee9" }}
            status={Math.round(secondProg) === 100 ? "success" : "active"}
          />
        </Row>
        <Row
          align={"middle"}
          gutter={4}
          style={{ marginBottom: "15px", marginTop: "10px", marginLeft: "5px" }}
        >
          <Col>
            {statusLabel !== "" && <AlertTwoTone twoToneColor="#2666CF" />}
          </Col>
          <Col>
            <Text style={{ color: "#2666CF", fontSize: "12px" }}>
              {statusLabel}
            </Text>
          </Col>
        </Row>
        <Row
          style={{ marginBottom: "15px", marginTop: "10px", marginLeft: "5px" }}
        >
          <Col>
            <Statistic
              loading={isActive}
              title="최종 수집 개수"
              value={finalDat.filter((d) => d["상품명"] !== "").length}
              suffix="개"
              prefix={<GiftFilled />}
              valueStyle={{
                color: "#0C2D57",
                fontFamily: "LINESeedKR-Bd",
              }}
            />
          </Col>
        </Row>

        <Divider />

        <Row style={{ marginBottom: "10px" }}>
          <Text style={{ fontSize: "12px", fontFamily: "LINESeedKR-Bd" }}>
            출력
          </Text>
        </Row>
        <Row>
          <Col style={{ marginRight: "5px" }}>
            <Button
              //   size="small"
              type="primary"
              disabled={isActive}
              icon={<FileExcelTwoTone twoToneColor={"#CDFAD5"} />}
              onClick={() => {
                if (finalDat.length === 0) {
                  messageApi.error({
                    content: "출력할 데이터가 없습니다!",
                    icon: <WarningTwoTone twoToneColor="#C70039" />,
                    style: { color: "#45474B" },
                  });
                  return;
                }
                exportWorksheet("Kream 상품 수집 정보 출력", finalDat, "xlsx");
              }}
            >
              <Text style={{ color: "#CDFAD5" }}>엑셀 출력</Text>
            </Button>
          </Col>
          <Col style={{ marginRight: "5px" }}>
            <Button
              //   size="small"
              type="primary"
              disabled={isActive}
              icon={<FileTextTwoTone twoToneColor={"#FFCF96"} />}
              onClick={() => {
                if (finalDat.length === 0) {
                  messageApi.error({
                    content: "출력할 데이터가 없습니다!",
                    icon: <WarningTwoTone twoToneColor="#C70039" />,
                    style: { color: "#45474B" },
                  });
                  return;
                }
                exportWorksheet("Kream 상품 수집 정보 출력", finalDat, "csv");
              }}
            >
              <Text style={{ color: "#FFCF96" }}>CSV 출력</Text>
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
}
