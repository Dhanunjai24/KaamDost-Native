// KaamDost - Modern Blue Design System Tokens (2026 Redesign)
export const COLORS = {
  // Brand Blue Primary Palette
  primary: '#2563eb',        // Electric Royal Blue
  primaryDark: '#1d4ed8',    // Deep Royal Blue
  primaryLight: '#eff6ff',   // Soft Ice Blue
  primarySoft: '#dbeafe',    // Light Sky Tint
  primaryGlow: 'rgba(37, 99, 235, 0.18)',

  // Brand Orange Accent (From KD Logo)
  brandOrange: '#ff6b00',
  brandOrangeLight: '#fff7ed',

  // Deep Navy for Headings & Text
  secondary: '#0f294a',      // Rich Midnight Navy
  secondaryLight: '#1e3a8a', // Royal Slate
  secondaryMuted: '#334155',

  // Status & Verification Greens
  accent: '#10b981',         // Verified Emerald Green
  accentLight: '#ecfdf5',
  accentDark: '#059669',

  // Warnings & Alerts
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  info: '#3b82f6',
  infoLight: '#eff6ff',

  // Background & Surfaces
  background: '#f0f7ff',     // Ambient Soft Blue
  backgroundGradientTop: '#e0efff',
  backgroundGradientBottom: '#f8faff',
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',
  
  // Borders
  border: '#dbeafe',
  borderLight: '#e2e8f0',
  cardBorder: '#e0edfd',

  // Typography Colors
  textPrimary: '#0f294a',    // High contrast Navy
  textSecondary: '#475569',  // Medium contrast Slate
  textMuted: '#94a3b8',      // Low contrast Silver
  textWhite: '#ffffff',
  textBlue: '#2563eb',

  // Indicators
  badgeGreen: '#10b981',
  badgeGold: '#f59e0b',
  onlineGreen: '#22c55e',
  offlineGray: '#94a3b8'
};

export const SHADOWS = {
  small: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  medium: {
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4
  },
  large: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8
  },
  buttonGlow: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  }
};

export const FONTS = {
  bold: 'System',
  semiBold: 'System',
  medium: 'System',
  regular: 'System'
};

