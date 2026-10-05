import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassListItem({
  title,
  subtitle,
  icon,
  leftElement,
  rightElement,
  badge,
  onPress,
  style,
  borderBottom = true
}) {
  const { theme } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        borderBottom && [styles.border, { borderBottomColor: theme.borderLight }],
        style
      ]}
    >
      <View style={styles.left}>
        {leftElement || (
          icon && (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.border,
                  borderWidth: 1
                }
              ]}
            >
              {typeof icon === 'string' ? (
                <Text style={styles.emojiIcon}>{icon}</Text>
              ) : (
                icon
              )}
            </View>
          )
        )}
        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
            {badge && <View style={styles.badgeBox}>{badge}</View>}
          </View>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.right}>
        {rightElement || (
          onPress ? (
            <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
          ) : null
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4
  },
  border: {
    borderBottomWidth: 1
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  emojiIcon: {
    fontSize: 20
  },
  textCol: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  badgeBox: {
    marginLeft: 6
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chevron: {
    fontSize: 22,
    fontWeight: '400',
    marginLeft: 6
  }
});
