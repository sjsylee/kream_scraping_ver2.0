import React from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Image,
  Space,
  Form,
  Button,
  Input,
  message,
  Card,
} from "antd";
import {
  ReconciliationTwoTone,
  RocketTwoTone,
  CheckCircleTwoTone,
  LoadingOutlined,
  DeleteTwoTone,
  CloseCircleTwoTone,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import LoginForm from "../components/LoginForm";

const { Text } = Typography;

export default function NextPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Row gutter={5} align="middle" justify="center">
        <Col>
          <Image src="/images/kream.png" width={20} preview={false} />
        </Col>
        <Col>
          <Text
            strong
            style={{
              fontSize: 15,
              fontFamily: "RussoOne-Regular",
              fontStyle: "italic",
            }}
          >
            HOME
          </Text>
        </Col>
      </Row>
      <Divider />
      <Row justify={"center"} gutter={12}>
        <Col>
          <LoginForm />
        </Col>
      </Row>
    </>
  );
}
