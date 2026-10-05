import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassCard({
  children,
  style,
  onPress,
  activeOpacity = 0.8,
  variant = 'default', // 'default', 'strong', 'subtle', 'flat'
  ...rest
}) {
  const { theme, shadows } = useTheme();

  let surfaceColor = theme.glassSurface;
  let borderColor = theme.glassBorder;
  let shadowStyle = shadows.glass;

  if (variant === 'strong') {
    surfaceColor = theme.glassSurfaceStrong;
    borderColor = theme.borderStrong;
    shadowStyle = shadows.medium;
  } else if (variant === 'subtle') {
    surfaceColor = theme.glassSurfaceSubtle;
    borderColor = theme.borderLight;
    shadowStyle = shadows.small;
  } else if (variant === 'flat') {
    surfaceColor = theme.glassSurface;
    shadowStyle = null;
  }

  const cardStyle = [
    styles.card,
    {
      backgroundColor: surfaceColor,
      borderColor: borderColor
    },
    shadowStyle,
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden'
  }
});
