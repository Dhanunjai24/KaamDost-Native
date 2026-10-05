import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 10,
  style
}) {
  const { theme } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.borderLight,
          opacity: opacityAnim
        },
        style
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderWidth: 1,
    overflow: 'hidden'
  }
});
