// KAAMDOST — Glassmorphic Design System Tokens
export const COLORS = {
  // Brand Blue Primary Palette
  primary: '#2563eb',             // Electric Royal Blue
  primaryDark: '#1d4ed8',         // Deep Royal Blue
  primaryGradientStart: '#3b82f6',
  primaryGradientEnd: '#1d4ed8',
  primaryLight: '#eff6ff',        // Soft Ice Blue
  primarySoft: '#dbeafe',         // Light Sky Tint
  primaryGlow: 'rgba(37, 99, 235, 0.18)',

  // Brand Orange Accent (From KD Logo)
  brandOrange: '#ff6b00',
  brandOrangeLight: '#fff7ed',

  // Deep Royal Navy for Headings & Text (#0f2c6e / #133072)
  secondary: '#0f2c6e',
  heading: '#0f2c6e',
  subtitle: '#5f7da6',           // Medium muted slate-blue
  secondaryMuted: '#5f7da6',

  // Status & Verification Greens
  accent: '#16a34a',              // Vibrant Verified Green
  accentLight: '#ecfdf5',
  accentDark: '#15803d',
  verifiedGreen: '#16a34a',

  // Warnings & Alerts
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  info: '#3b82f6',
  infoLight: '#eff6ff',

  // Canvas & Background
  background: '#f0f6ff',          // Ambient Sky Tint
  backgroundCanvas: '#eaf2ff',
  backgroundGradientTop: '#eaf2ff',
  backgroundGradientBottom: '#f0f6ff',

  // Glassmorphism Surface Tokens
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',
  surfaceGlassInner: 'rgba(255, 255, 255, 0.60)',
  glassBorder: 'rgba(255, 255, 255, 0.85)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.65)',

  // Standard Borders
  border: '#dbeafe',
  borderLight: '#e2e8f0',
  cardBorder: '#e0edfd',

  // Typography Colors
  textPrimary: '#0f2c6e',         // Deep Royal Navy
  textSecondary: '#5f7da6',       // Slate-blue
  textMuted: '#94a3b8',
  textWhite: '#ffffff',
  textBlue: '#2563eb',

  // Indicators
  badgeGreen: '#16a34a',
  badgeGold: '#f59e0b',
  onlineGreen: '#22c55e',
  offlineGray: '#94a3b8'
};

export const SHADOWS = {
  sm: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  small: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  md: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4
  },
  medium: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4
  },
  lg: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 30,
    elevation: 8
  },
  large: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 30,
    elevation: 8
  },
  buttonGlow: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 8
  },
  primaryBtn: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 8
  }
};

export const FONTS = {
  bold: 'System',
  semiBold: 'System',
  medium: 'System',
  regular: 'System'
};
