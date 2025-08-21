// Intercom Design System Colors and Theme
export const IntercomTheme = {
  colors: {
    // Primary Intercom colors
    primary: '#00B4FF', // Intercom Blue
    primaryHover: '#0091D1',
    primaryDark: '#006B99',
    
    // Secondary colors
    secondary: '#FF6900', // Intercom Orange
    secondaryHover: '#E55A00',
    
    // Success/Green
    success: '#38C93A',
    successHover: '#2DB32E',
    
    // Warning/Yellow
    warning: '#FFD93A',
    warningHover: '#E6C233',
    
    // Error/Red
    error: '#FF3A5C',
    errorHover: '#E5334F',
    
    // Purple
    purple: '#7B68EE',
    purpleHover: '#6B5AE0',
    
    // Background colors
    background: '#F8F9FA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F3F4F6',
    
    // Text colors
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#E5E7EB',
    borderHover: '#D1D5DB',
    borderActive: '#00B4FF',
    
    // Chart colors (Intercom-inspired palette)
    chart: {
      blue: '#00B4FF',
      orange: '#FF6900',
      green: '#38C93A',
      yellow: '#FFD93A',
      red: '#FF3A5C',
      purple: '#7B68EE',
      teal: '#14B8A6',
      indigo: '#6366F1'
    }
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    fontSizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px'
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

export default IntercomTheme;