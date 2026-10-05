// KaamDost - Global 2-Color Glassmorphic Design System
// Centralized theme tokens and color definitions

export const THEMES = {
  // THEME 1 — LIGHT + NAVY BLUE (PRIMARY DEFAULT)
  light_navy: {
    id: 'light_navy',
    name: 'Light + Navy Blue',
    tagline: 'Clean, modern, crisp cool-white with deep royal navy typography',
    isDefault: true,

    // Backgrounds (predominantly light)
    backgroundPrimary: '#F4F8FC',
    backgroundSecondary: '#EAF1F8',
    background: '#F4F8FC', // alias

    // Glass surfaces
    glassSurface: 'rgba(255, 255, 255, 0.72)',
    glassSurfaceStrong: 'rgba(255, 255, 255, 0.90)',
    glassSurfaceSubtle: 'rgba(255, 255, 255, 0.55)',
    surface: '#FFFFFF',
    surfaceCard: 'rgba(255, 255, 255, 0.78)',

    // Typography (Navy Blue)
    textPrimary: '#0B2341',
    textSecondary: '#48627D',
    textMuted: '#6C86A3',
    textWhite: '#FFFFFF',

    // Accents & UI Elements
    primary: '#173F6B',
    primaryDark: '#0B2341',
    primaryLight: '#EAF1F8',
    primarySoft: 'rgba(23, 63, 107, 0.10)',
    accent: '#173F6B',
    accentPrimary: '#173F6B',
    accentLight: '#EAF1F8',
    secondary: '#0B2341',
    secondaryLight: '#173F6B',

    // Borders (10% to 16% navy)
    border: 'rgba(11, 35, 65, 0.12)',
    borderLight: 'rgba(11, 35, 65, 0.08)',
    borderStrong: 'rgba(11, 35, 65, 0.20)',
    glassBorder: 'rgba(11, 35, 65, 0.12)',

    // Buttons
    buttonPrimary: '#0B2341',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: 'rgba(255, 255, 255, 0.75)',
    buttonSecondaryText: '#0B2341',
    buttonSecondaryBorder: 'rgba(11, 35, 65, 0.15)',

    // Shadows & Ambient Glows
    shadowColor: '#0B2341',
    ambientGlow1: 'rgba(23, 63, 107, 0.08)',
    ambientGlow2: 'rgba(72, 98, 125, 0.06)',

    // Status colors (Semantic)
    success: '#10B981',
    successLight: '#E6F7F0',
    warning: '#F59E0B',
    warningLight: '#FEF7EA',
    danger: '#EF4444',
    dangerLight: '#FEECEB',
    info: '#173F6B',
    infoLight: '#EAF1F8',

    badgeGreen: '#10B981',
    badgeGold: '#F59E0B',
    onlineGreen: '#10B981',
    offlineGray: '#6C86A3'
  },

  // THEME 2 — WHITE + DEEP TEAL
  white_teal: {
    id: 'white_teal',
    name: 'White + Deep Teal',
    tagline: 'Soft mint freshness with authoritative deep teal typography',
    isDefault: false,

    // Backgrounds (predominantly light)
    backgroundPrimary: '#F6FBFA',
    backgroundSecondary: '#EAF6F4',
    background: '#F6FBFA', // alias

    // Glass surfaces
    glassSurface: 'rgba(255, 255, 255, 0.72)',
    glassSurfaceStrong: 'rgba(255, 255, 255, 0.90)',
    glassSurfaceSubtle: 'rgba(255, 255, 255, 0.55)',
    surface: '#FFFFFF',
    surfaceCard: 'rgba(255, 255, 255, 0.78)',

    // Typography (Deep Teal)
    textPrimary: '#073B3A',
    textSecondary: '#4B6B6A',
    textMuted: '#6F8E8D',
    textWhite: '#FFFFFF',

    // Accents & UI Elements
    primary: '#0B6663',
    primaryDark: '#073B3A',
    primaryLight: '#EAF6F4',
    primarySoft: 'rgba(11, 102, 99, 0.10)',
    accent: '#0B6663',
    accentPrimary: '#0B6663',
    accentLight: '#EAF6F4',
    secondary: '#073B3A',
    secondaryLight: '#0B6663',

    // Borders (10% to 16% teal)
    border: 'rgba(7, 59, 58, 0.12)',
    borderLight: 'rgba(7, 59, 58, 0.08)',
    borderStrong: 'rgba(7, 59, 58, 0.20)',
    glassBorder: 'rgba(7, 59, 58, 0.12)',

    // Buttons
    buttonPrimary: '#073B3A',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: 'rgba(255, 255, 255, 0.75)',
    buttonSecondaryText: '#073B3A',
    buttonSecondaryBorder: 'rgba(7, 59, 58, 0.15)',

    // Shadows & Ambient Glows
    shadowColor: '#073B3A',
    ambientGlow1: 'rgba(11, 102, 99, 0.08)',
    ambientGlow2: 'rgba(75, 107, 106, 0.06)',

    // Status colors (Semantic)
    success: '#10B981',
    successLight: '#E6F7F0',
    warning: '#F59E0B',
    warningLight: '#FEF7EA',
    danger: '#EF4444',
    dangerLight: '#FEECEB',
    info: '#0B6663',
    infoLight: '#EAF6F4',

    badgeGreen: '#10B981',
    badgeGold: '#F59E0B',
    onlineGreen: '#10B981',
    offlineGray: '#6F8E8D'
  },

  // THEME 3 — SOFT IVORY + DEEP INDIGO
  ivory_indigo: {
    id: 'ivory_indigo',
    name: 'Soft Ivory + Deep Indigo',
    tagline: 'Warm ivory surface with aristocratic deep indigo typography',
    isDefault: false,

    // Backgrounds (predominantly light)
    backgroundPrimary: '#FAF9F6',
    backgroundSecondary: '#F2F1F7',
    background: '#FAF9F6', // alias

    // Glass surfaces
    glassSurface: 'rgba(255, 255, 255, 0.72)',
    glassSurfaceStrong: 'rgba(255, 255, 255, 0.90)',
    glassSurfaceSubtle: 'rgba(255, 255, 255, 0.55)',
    surface: '#FFFFFF',
    surfaceCard: 'rgba(255, 255, 255, 0.78)',

    // Typography (Deep Indigo)
    textPrimary: '#25234A',
    textSecondary: '#66657D',
    textMuted: '#87869E',
    textWhite: '#FFFFFF',

    // Accents & UI Elements
    primary: '#38356F',
    primaryDark: '#25234A',
    primaryLight: '#F2F1F7',
    primarySoft: 'rgba(56, 53, 111, 0.10)',
    accent: '#38356F',
    accentPrimary: '#38356F',
    accentLight: '#F2F1F7',
    secondary: '#25234A',
    secondaryLight: '#38356F',

    // Borders (10% to 16% indigo)
    border: 'rgba(37, 35, 74, 0.12)',
    borderLight: 'rgba(37, 35, 74, 0.08)',
    borderStrong: 'rgba(37, 35, 74, 0.20)',
    glassBorder: 'rgba(37, 35, 74, 0.12)',

    // Buttons
    buttonPrimary: '#25234A',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: 'rgba(255, 255, 255, 0.75)',
    buttonSecondaryText: '#25234A',
    buttonSecondaryBorder: 'rgba(37, 35, 74, 0.15)',

    // Shadows & Ambient Glows
    shadowColor: '#25234A',
    ambientGlow1: 'rgba(56, 53, 111, 0.08)',
    ambientGlow2: 'rgba(102, 101, 125, 0.06)',

    // Status colors (Semantic)
    success: '#10B981',
    successLight: '#E6F7F0',
    warning: '#F59E0B',
    warningLight: '#FEF7EA',
    danger: '#EF4444',
    dangerLight: '#FEECEB',
    info: '#38356F',
    infoLight: '#F2F1F7',

    badgeGreen: '#10B981',
    badgeGold: '#F59E0B',
    onlineGreen: '#10B981',
    offlineGray: '#87869E'
  }
};

// Soft Tinted Shadow generator for layered glass surfaces
export const createShadows = (shadowColor = '#0B2341') => ({
  small: {
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  medium: {
    shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  large: {
    shadowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 28,
    elevation: 8
  },
  glass: {
    shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 3
  }
});

// Default active theme instance (Theme 1: Light + Navy Blue)
export const DEFAULT_THEME_ID = 'light_navy';
export const DEFAULT_THEME = THEMES[DEFAULT_THEME_ID];

// Backward-compatible static exports (pointing to Theme 1 Light + Navy Blue)
export const COLORS = THEMES.light_navy;
export const SHADOWS = createShadows(THEMES.light_navy.shadowColor);

export const FONTS = {
  bold: 'System',
  semiBold: 'System',
  medium: 'System',
  regular: 'System'
};

// Helper function to resolve theme by ID
export const getTheme = (id) => THEMES[id] || THEMES.light_navy;
