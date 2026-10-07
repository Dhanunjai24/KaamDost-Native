import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassBackground({ children, style }) {
  const { theme } = useTheme();

  const isDark = theme.id === 'slate_orange' || (theme.backgroundPrimary && theme.backgroundPrimary.startsWith('#0'));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundPrimary }, style]}>
      {/* Ambient blurred glowing orbs creating exact depth and illuminated blur backdrop */}
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowTopRight,
          {
            backgroundColor: isDark ? 'rgba(255, 107, 0, 0.16)' : (theme.ambientGlow1 || 'rgba(23, 63, 107, 0.08)'),
            width: isDark ? 280 : 240,
            height: isDark ? 280 : 240
          }
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowMiddleLeft,
          {
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : (theme.ambientGlow2 || 'rgba(72, 98, 125, 0.06)')
          }
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowCenterRight,
          {
            backgroundColor: isDark ? 'rgba(255, 138, 0, 0.12)' : (theme.ambientGlow1 || 'rgba(23, 63, 107, 0.08)')
          }
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowBottomLeft,
          {
            backgroundColor: isDark ? 'rgba(30, 58, 95, 0.35)' : (theme.ambientGlow2 || 'rgba(72, 98, 125, 0.06)')
          }
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  glowCircle: {
    position: 'absolute',
    borderRadius: 9999
  },
  glowTopRight: {
    top: -40,
    right: -40
  },
  glowMiddleLeft: {
    top: '32%',
    left: -80,
    width: 220,
    height: 220
  },
  glowCenterRight: {
    top: '48%',
    right: -70,
    width: 200,
    height: 200
  },
  glowBottomLeft: {
    bottom: 20,
    left: -60,
    width: 260,
    height: 260
  }
});
