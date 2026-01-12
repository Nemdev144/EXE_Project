import { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#8B0000',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // Improved colors for better visibility
    colorBgContainer: '#ffffff',
    colorBgElevated: '#fafafa',
    colorBorder: '#e8e8e8',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
      primaryColor: '#ffffff',
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      headerBg: '#fafafa',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#fff0f0',
      borderColor: '#e8e8e8',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      activeBorderColor: '#8B0000',
      hoverBorderColor: '#8B0000',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      activeBorderColor: '#8B0000',
      hoverBorderColor: '#8B0000',
    },
    Menu: {
      borderRadius: 8,
      itemSelectedBg: '#fff0f0',
      itemSelectedColor: '#8B0000',
      itemHoverBg: '#f5f5f5',
      itemHoverColor: '#8B0000',
    },
    Tag: {
      borderRadius: 6,
      fontSize: 12,
      lineHeight: '20px',
    },
    Progress: {
      defaultColor: '#8B0000',
      remainingColor: '#f0f0f0',
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
    },
  },
};
