import React from "react";
import {
  Button,
  Space,
  Card,
  Form,
  message,
  Row,
  Radio,
  Image,
  Col,
  Typography,
  Input,
} from "antd";
import { useState } from "react";

import {
  ReconciliationTwoTone,
  RocketTwoTone,
  IdcardOutlined,
  LoadingOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { fetchJson } from "../lib/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { StyleProvider } from "@ant-design/cssinjs";

const { Text } = Typography;

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>();
  const [isFailed, setIsFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAlLog = localStorage.getItem(`isLogin`);
    if (isAlLog === "true") {
      setIsLogin(true);
      const username = JSON.parse(localStorage.getItem(`profile`));
      setCurrentUser(username.id.split("@")[0]);
    }
  }, []);

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Space style={{ marginTop: "32px" }}>
      <Card hoverable style={{ width: 450, height: 280 }} bordered>
        {!isLogin && (
          <>
            <Row
              gutter={8}
              justify={"center"}
              align={"middle"}
              style={{ marginBottom: 10 }}
            >
              <Col></Col>
              <Col>
                <IdcardOutlined />
              </Col>
              <Col>
                <Text
                  strong
                  style={{
                    fontSize: 14,
                    fontFamily: "RussoOne-Regular",
                    fontStyle: "italic",
                  }}
                >
                  LOGIN
                </Text>
              </Col>
            </Row>
            <Form
              form={form}
              style={{
                maxWidth: 700,
                fontStyle: "italic",
              }}
              onFinish={(value) => {
                messageApi.loading("로그인을 진행합니다...");
                setIsLoading(true);

                // if (value.platform === "kream") {
                fetchJson("/api/kream_login", {
                  method: "POST",
                  body: JSON.stringify(value),
                }).then((res) => {
                  if (res.success) {
                    setIsLoading(false);
                    localStorage.setItem(`isLogin`, "true");
                    localStorage.setItem(`token`, res.data);
                    localStorage.setItem(`profile`, JSON.stringify(value));
                    setIsLogin(true);
                    setCurrentUser(value.id.split("@")[0]);
                    setIsFailed(false);
                  } else {
                    setIsLoading(false);
                    setIsFailed(true);
                    return;
                  }
                });
              }}
            >
              <Row justify={"center"}>
                <Form.Item
                  name="id"
                  label="Email"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 19 }}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "아이디를 입력해주세요.",
                    },
                  ]}
                  style={{ marginRight: 25 }}
                >
                  <Input size="small" style={{ width: 197 }} />
                </Form.Item>
              </Row>
              <Row justify={"center"}>
                <Form.Item
                  name="pswd"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 19 }}
                  label="Password"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "패스워드를 입력해주세요.",
                    },
                  ]}
                  style={{ marginRight: 23 }}
                >
                  <Input.Password size="small" style={{ width: "200px" }} />
                </Form.Item>
              </Row>
              <Row justify={"center"}>
                <Form.Item
                  name="platform"
                  rules={[
                    {
                      whitespace: true,
                    },
                  ]}
                >
                  <Radio.Group defaultValue="kream">
                    <Radio value="kream">
                      <Row align={"middle"} gutter={3}>
                        <Col>
                          <Image
                            src="/images/kream.png"
                            width={18}
                            preview={false}
                          />
                        </Col>
                        <Col>
                          <Text
                            style={{
                              fontSize: "11px",
                              fontFamily: "RussoOne-Regular",
                            }}
                          >
                            KREAM
                          </Text>
                        </Col>
                      </Row>
                    </Radio>
                    {/* <Radio value="naver">
                      <Row align={"middle"} gutter={6}>
                        <Col>
                          <Image
                            src="/images/naver.png"
                            style={{ borderRadius: "5px" }}
                            width={16}
                            preview={false}
                          />
                        </Col>
                        <Col>
                          <Text
                            style={{ fontStyle: "normal", fontSize: "11px" }}
                          >
                            NAVER
                          </Text>
                        </Col>
                      </Row>
                    </Radio> */}
                  </Radio.Group>
                </Form.Item>
              </Row>
              <Form.Item>
                <Row
                  gutter={10}
                  justify={"center"}
                  style={{ marginTop: "5px" }}
                >
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<RocketTwoTone twoToneColor="#45474B" />}
                    >
                      로그인
                      {isLoading && <LoadingOutlined />}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      htmlType="button"
                      onClick={onReset}
                      icon={<DeleteTwoTone twoToneColor="#45474B" />}
                    >
                      초기화
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            {isFailed && (
              <Row justify={"center"} align={"middle"} gutter={3}>
                <Col>
                  <Text style={{ fontSize: 11, color: "#D71313" }}>
                    ※ 로그인 실패, 아이디, 패스워드, 네트워크 상태를
                    확인해주세요.
                  </Text>
                </Col>
              </Row>
            )}
          </>
        )}
        {isLogin && (
          <>
            <Row
              gutter={10}
              align="middle"
              justify="center"
              style={{ marginBottom: 55 }}
            >
              <Col></Col>
              <Col>
                <IdcardOutlined />
              </Col>
              <Col>
                <Text
                  strong
                  style={{
                    fontSize: 14,
                    fontFamily: "RussoOne-Regular",
                    fontStyle: "italic",
                  }}
                >
                  LOGIN INFO
                </Text>
              </Col>
            </Row>
            <Row
              align={"middle"}
              gutter={8}
              justify="center"
              style={{ marginTop: "34px" }}
            >
              <Col>
                <Row gutter={10} align="middle" justify="center">
                  <Col>
                    <UserOutlined />
                  </Col>
                  <Col>
                    <Text
                      strong
                      style={{
                        fontSize: 14,
                        fontFamily: "RussoOne-Regular",
                        fontStyle: "italic",
                      }}
                    >
                      username:
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    fontFamily: "RussoOne-Regular",
                    fontStyle: "italic",
                    color: "#CD5C08",
                  }}
                >
                  {currentUser}
                </Text>
              </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 34 }}>
              <Button
                type="primary"
                // size="small"
                style={{ fontSize: 14, marginTop: 20 }}
                icon={<LogoutOutlined />}
                onClick={() => {
                  setIsLogin(false);
                  localStorage.setItem(`isLogin`, "false");
                  localStorage.removeItem(`token`);
                }}
              >
                로그아웃
              </Button>
            </Row>
          </>
        )}
      </Card>
    </Space>
  );
}
