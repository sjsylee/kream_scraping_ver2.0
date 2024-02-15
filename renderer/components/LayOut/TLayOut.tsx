import React, { useState } from "react";
import {
  DesktopOutlined,
  ToTopOutlined,
  DollarOutlined,
  HomeOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Row, Col, Image } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface LCProps {
  children: React.ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("로그인", "home", <HomeOutlined />),
  getItem("상품 정보 수집", "scraping", <ReconciliationOutlined />),
];

const App: React.FC<LCProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isCol, setIsCol] = useState(false);
  const router = useRouter();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        width={165}
        collapsed={collapsed}
        onCollapse={(value) => {
          if (value) {
            setIsCol(value);
            setCollapsed(value);
          } else {
            setCollapsed(value);
            setTimeout(() => {
              setIsCol(value);
            }, 170);
          }
        }}
        style={{
          background: "#EFECEC",
        }}
      >
        <div className="titlebar" style={{ padding: 20 }} />
        <div
          className="titlebar"
          style={
            !collapsed
              ? {
                  marginBottom: "14px",
                  marginLeft: "10px",
                }
              : { marginBottom: "14px", marginLeft: "7px" }
          }
        >
          <Row align="middle" gutter={2}>
            <Col>
              <Image
                style={!collapsed ? {} : { marginLeft: "10.3px" }}
                src="/images/kream.png"
                width={!collapsed ? 29 : 42}
                preview={false}
              />
            </Col>

            <Col>
              {!isCol && (
                <div
                  style={{
                    color: "#092635",
                    fontSize: "13",
                    fontFamily: "RussoOne-Regular",
                    fontStyle: "italic",
                  }}
                >
                  KREAM SCRAPING
                </div>
              )}
            </Col>
          </Row>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          selectedKeys={[router.pathname.replace("/", "")]}
          onClick={({ key }) => {
            router.replace(key);
          }}
          style={{
            background: "#EFECEC",
          }}
        />
      </Sider>
      <Layout>
        <Header
          className="titlebar"
          style={{ padding: 0, background: "#EFECEC", height: 20 }}
        />
        <Content
          style={{
            padding: 24,
            minHeight: 640,
            background: "#EFECEC",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{ textAlign: "center", fontSize: 10, background: "#EFECEC" }}
        >
          Created by LS Hay
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
