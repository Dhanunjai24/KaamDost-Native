import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassButton({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  activeOpacity = 0.82
}) {
  const { theme, shadows } = useTheme();

  // Variant styling
  let containerStyle = {};
  let labelStyle = {};

  if (variant === 'primary') {
    containerStyle = {
      backgroundColor: theme.buttonPrimary,
      borderWidth: 0,
      ...shadows.small
    };
    labelStyle = {
      color: theme.buttonPrimaryText,
      fontWeight: '700'
    };
  } else if (variant === 'secondary') {
    containerStyle = {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.small
    };
    labelStyle = {
      color: theme.textPrimary,
      fontWeight: '700'
    };
  } else if (variant === 'outline') {
    containerStyle = {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.accentPrimary
    };
    labelStyle = {
      color: theme.accentPrimary,
      fontWeight: '700'
    };
  } else if (variant === 'ghost') {
    containerStyle = {
      backgroundColor: 'transparent',
      borderWidth: 0
    };
    labelStyle = {
      color: theme.textPrimary,
      fontWeight: '600'
    };
  }

  // Size styling
  let sizeStyle = styles.md;
  let textSize = 14;

  if (size === 'sm') {
    sizeStyle = styles.sm;
    textSize = 12;
  } else if (size === 'lg') {
    sizeStyle = styles.lg;
    textSize = 16;
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyle,
        containerStyle,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.buttonPrimaryText : theme.textPrimary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              { fontSize: textSize },
              labelStyle,
              textStyle
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    marginRight: 6
  },
  label: {
    letterSpacing: -0.2
  },
  sm: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    minHeight: 34
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 46
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    minHeight: 52
  },
  disabled: {
    opacity: 0.5
  }
});
