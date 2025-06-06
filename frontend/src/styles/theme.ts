// テーマ定数の定義
export const theme = {
  colors: {
    primary: '#008d97',
    primaryLight: '#00cc99',
    primaryDark: '#006975',
    success: '#4caf50',
    successLight: '#81c784',
    error: '#f44336',
    errorLight: '#ef9a9a',
    text: {
      primary: 'rgb(17, 24, 39)',
      secondary: 'rgb(107, 114, 128)',
      placeholder: 'rgb(156, 163, 175)',
      label: 'rgb(55, 65, 81)',
      required: '#e53e3e',
    },
    background: {
      main: '#F8F9FD',
      card: 'linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)',
      white: 'white',
    },
    border: {
      default: 'rgb(209, 213, 219)',
      focus: '#008d97',
      light: 'rgba(0, 0, 0, 0.05)',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '25px',
    xxxl: '30px',
    xxxxl: '40px',
  },
  borderRadius: {
    sm: '6px',
    md: '15px',
    lg: '20px',
    xl: '40px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    primary: 'rgba(0, 141, 151, 0.3) 0px 30px 30px -20px',
    primaryButton: 'rgba(0, 141, 151, 0.4) 0px 20px 10px -15px',
    success: 'rgba(76, 175, 80, 0.3) 0px 10px 10px -5px',
    error: 'rgba(244, 67, 54, 0.3) 0px 10px 10px -5px',
    focus: '0 0 0 3px rgba(0, 141, 151, 0.1)',
  },
  transitions: {
    fast: 'all 0.1s ease-in-out',
    normal: 'all 0.2s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
  sizes: {
    formMaxWidth: '400px',
    dropdownMaxHeight: '200px',
  },
} as const;

export type Theme = typeof theme;
