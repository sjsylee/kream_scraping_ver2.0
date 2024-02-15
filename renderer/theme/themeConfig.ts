// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
    Layout: {
      triggerBg: "#FC6736",
    },
    Menu: {
      darkItemColor: "#45474B",
    },
    Divider: {
      verticalMarginInline: 1,
    },
    Message: {
      contentBg: "#EFECEC",
      fontSize: 14,
    },
    Form: {
      labelFontSize: 12,
      itemMarginBottom: 7,
    },
    Modal: {
      contentBg: "#EFECEC",
      headerBg: "#EFECEC",
      titleFontSize: 14,
    },
    Table: {
      bodySortBg: "#161A30",
      cellPaddingBlock: 4,
      cellFontSize: 12,
      headerBg: "#222831",
      headerColor: "#EFECEC",
    },
    Statistic: {
      contentFontSize: 18,
      titleFontSize: 11,
    },
  },
  token: {
    fontSize: 13,
    fontFamily: "LINESeedKR-Rg",
    colorPrimary: "#0C2D57",
  },
};

export default theme;
