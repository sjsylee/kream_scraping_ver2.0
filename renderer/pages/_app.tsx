import React from "react";
import { ConfigProvider, FloatButton } from "antd";
import { QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import type { AppProps } from "next/app";
import TLayOut from "../components/LayOut/TLayOut";
import "../styles/globals.css";

import theme from "../theme/themeConfig";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <TLayOut>
      <Component {...pageProps} />
    </TLayOut>
  </ConfigProvider>
);

export default App;
