import { Dimensions, PixelRatio, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Base guideline dimensions based on standard modern smartphone (iPhone 13 / Pixel 5)
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

/**
 * Linear width-based scaling
 */
export const scale = (size) => {
  const { width } = Dimensions.get('window');
  return Math.round((width / GUIDELINE_BASE_WIDTH) * size);
};

/**
 * Linear height-based scaling
 */
export const verticalScale = (size) => {
  const { height } = Dimensions.get('window');
  return Math.round((height / GUIDELINE_BASE_HEIGHT) * size);
};

/**
 * Moderate scaling with resize factor (default 0.5)
 * Good for padding, margin, icons, and cards to prevent extreme sizes on tablets/mini screens.
 */
export const moderateScale = (size, factor = 0.5) => {
  const { width } = Dimensions.get('window');
  return Math.round(size + ((width / GUIDELINE_BASE_WIDTH) * size - size) * factor);
};

/**
 * Responsive font scaler with accessibility & boundary clamp
 */
export const fontSize = (size) => {
  const { width, fontScale } = Dimensions.get('window');
  const scaleRatio = width / GUIDELINE_BASE_WIDTH;
  
  // Moderate ratio to avoid giant fonts on tablets or tiny fonts on small screens
  const moderatedRatio = 1 + (scaleRatio - 1) * 0.45;
  const newSize = size * moderatedRatio;

  // Clamp font scale factor from OS accessibility to max 1.25 to prevent layout breakage
  const effectiveFontScale = Math.min(fontScale || 1, 1.25);
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize * effectiveFontScale));
};

/**
 * Percentage width calculation (e.g. wp(90) => 90% of screen width)
 */
export const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return Math.round((percentage * width) / 100);
};

/**
 * Percentage height calculation (e.g. hp(20) => 20% of screen height)
 */
export const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return Math.round((percentage * height) / 100);
};

/**
 * Hook for full reactive responsive layout across orientation and window changes
 */
export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 480;
  const isLargePhone = width >= 480 && width < 600;
  const isTablet = width >= 600;
  const isLandscape = width > height;

  // Responsive padding: compact on small screens, comfortable on standard, spacious on tablets
  const containerPadding = isTablet ? 32 : isSmallScreen ? 14 : 18;
  const gridColumnCount = isTablet ? (isLandscape ? 4 : 3) : 2;

  const rScale = (size) => Math.round((width / GUIDELINE_BASE_WIDTH) * size);
  const rVerticalScale = (size) => Math.round((height / GUIDELINE_BASE_HEIGHT) * size);
  const rModerateScale = (size, factor = 0.5) =>
    Math.round(size + ((width / GUIDELINE_BASE_WIDTH) * size - size) * factor);
  const rFontSize = (size) => {
    const scaleRatio = width / GUIDELINE_BASE_WIDTH;
    const moderatedRatio = 1 + (scaleRatio - 1) * 0.45;
    const effectiveFontScale = Math.min(fontScale || 1, 1.25);
    return Math.round(PixelRatio.roundToNearestPixel(size * moderatedRatio * effectiveFontScale));
  };

  return {
    width,
    height,
    insets,
    isSmallScreen,
    isMediumScreen,
    isLargePhone,
    isTablet,
    isLandscape,
    containerPadding,
    gridColumnCount,
    scale: rScale,
    verticalScale: rVerticalScale,
    moderateScale: rModerateScale,
    fontSize: rFontSize,
    wp: (pct) => Math.round((pct * width) / 100),
    hp: (pct) => Math.round((pct * height) / 100)
  };
}

export default {
  scale,
  verticalScale,
  moderateScale,
  fontSize,
  wp,
  hp,
  useResponsive
};
