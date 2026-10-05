import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassToast({
  visible = false,
  message,
  type = 'info', // 'success', 'warning', 'danger', 'info'
  icon,
  duration = 3000,
  onDismiss,
  style
}) {
  const { theme, shadows } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 20,
        useNativeDriver: true,
        friction: 6
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, duration, onDismiss]);

  if (!visible) return null;

  let bg = theme.glassSurfaceStrong;
  let fg = theme.textPrimary;
  let defaultIcon = 'ℹ️';

  if (type === 'success') {
    bg = theme.successLight;
    fg = theme.success;
    defaultIcon = '✓';
  } else if (type === 'warning') {
    bg = theme.warningLight;
    fg = theme.warning;
    defaultIcon = '⚠️';
  } else if (type === 'danger') {
    bg = theme.dangerLight;
    fg = theme.danger;
    defaultIcon = '✕';
  }

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: bg,
          borderColor: theme.borderStrong
        },
        shadows.large,
        style
      ]}
    >
      <Text style={styles.icon}>{icon || defaultIcon}</Text>
      <Text style={[styles.message, { color: fg }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.2
  },
  icon: {
    fontSize: 16,
    marginRight: 10
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1
  }
});
