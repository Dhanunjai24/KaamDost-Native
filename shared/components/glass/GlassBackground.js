import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassBackground({ children, style }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundPrimary }, style]}>
      {/* Decorative ambient radial glows behind the glass surfaces */}
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowTopRight,
          { backgroundColor: theme.ambientGlow1 }
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowBottomLeft,
          { backgroundColor: theme.ambientGlow2 }
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          styles.glowCenterRight,
          { backgroundColor: theme.ambientGlow1 }
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
    top: -60,
    right: -60,
    width: 240,
    height: 240
  },
  glowBottomLeft: {
    bottom: 40,
    left: -70,
    width: 260,
    height: 260
  },
  glowCenterRight: {
    top: '40%',
    right: -90,
    width: 200,
    height: 200
  }
});
