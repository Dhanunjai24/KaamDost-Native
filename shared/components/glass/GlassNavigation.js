import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassNavigation({
  items = [],
  activeId,
  onSelect,
  style
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderTopColor: theme.border
        },
        shadows.medium,
        style
      ]}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconBox,
                isActive && {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.borderStrong,
                  borderWidth: 1
                }
              ]}
            >
              {typeof item.icon === 'string' ? (
                <Text style={styles.emojiIcon}>{item.icon}</Text>
              ) : (
                item.icon
              )}
            </View>
            <Text
              style={[
                styles.navLabel,
                {
                  color: isActive ? theme.textPrimary : theme.textSecondary,
                  fontWeight: isActive ? '800' : '500'
                }
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1.2
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  emojiIcon: {
    fontSize: 18
  },
  navLabel: {
    fontSize: 11,
    letterSpacing: -0.2
  }
});
