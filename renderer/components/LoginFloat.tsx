import React, { useState } from "react";
import { Button, FloatButton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  LoginOutlined,
  CommentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const LoginFloat = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const lIsLogin = localStorage.getItem("isLogin");
    if (lIsLogin === "true") {
      setIsLogin(true);
    }
  }, [isLogin]);

  return (
    <>
      {isLogin && (
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ left: 24 }}
          icon={<UserOutlined />}
        >
          <FloatButton
            icon={<LogoutOutlined />}
            tooltip={<Text style={{ color: "#E95793" }}>로그아웃</Text>}
            onClick={() => {
              setIsLogin(false);
              localStorage.setItem("isLogin", "false");
              localStorage.setItem("cookie", null);
              router.replace("/login");
            }}
          />
          <FloatButton icon={<CommentOutlined />} />
        </FloatButton.Group>
      )}
      {!isLogin && (
        <FloatButton
          icon={<LoginOutlined />}
          tooltip={<Text style={{ color: "#E95793" }}>로그인</Text>}
          type="primary"
          style={{ left: 24 }}
          onClick={() => {
            router.replace("login");
          }}
        />
      )}
    </>
  );
};

export default LoginFloat;
