import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassStatusBadge({
  status = 'ACTIVE',
  label,
  variant, // 'success', 'warning', 'danger', 'info', or auto from status
  size = 'md',
  style
}) {
  const { theme } = useTheme();

  // Normalize status key
  const normalized = (status || '').toUpperCase();

  let resolvedVariant = variant;
  if (!resolvedVariant) {
    if (['COMPLETED', 'VERIFIED', 'SUCCESS', 'PAID', 'ON_DUTY', 'ACCEPTED'].includes(normalized)) {
      resolvedVariant = 'success';
    } else if (['PENDING', 'ARRIVING', 'EN_ROUTE', 'IN_PROGRESS', 'MATCHING', 'REVIEW'].includes(normalized)) {
      resolvedVariant = 'warning';
    } else if (['CANCELLED', 'REJECTED', 'FAILED', 'OFF_DUTY', 'DISPUTED'].includes(normalized)) {
      resolvedVariant = 'danger';
    } else {
      resolvedVariant = 'info';
    }
  }

  let bg = theme.primaryLight;
  let fg = theme.textPrimary;

  if (resolvedVariant === 'success') {
    bg = theme.successLight;
    fg = theme.success;
  } else if (resolvedVariant === 'warning') {
    bg = theme.warningLight;
    fg = theme.warning;
  } else if (resolvedVariant === 'danger') {
    bg = theme.dangerLight;
    fg = theme.danger;
  } else if (resolvedVariant === 'info') {
    bg = theme.primaryLight;
    fg = theme.textPrimary;
  }

  const displayLabel = label || status;

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        {
          backgroundColor: bg,
          borderColor: fg,
          borderWidth: 0.8
        },
        style
      ]}
    >
      <View style={[styles.dot, { backgroundColor: fg }]} />
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          { color: fg }
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  textSm: {
    fontSize: 9
  }
});
