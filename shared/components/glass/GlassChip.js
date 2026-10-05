import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassChip({
  label,
  selected = false,
  onPress,
  icon,
  count,
  style
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.buttonPrimary : theme.glassSurface,
          borderColor: selected ? theme.buttonPrimary : theme.border
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon ? <View style={styles.iconBox}>{icon}</View> : null}
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.buttonPrimaryText : theme.textPrimary,
            fontWeight: selected ? '700' : '600'
          }
        ]}
      >
        {label}
      </Text>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: selected ? 'rgba(255, 255, 255, 0.2)' : theme.primaryLight
            }
          ]}
        >
          <Text
            style={[
              styles.countText,
              { color: selected ? theme.buttonPrimaryText : theme.textPrimary }
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8
  },
  iconBox: {
    marginRight: 6
  },
  label: {
    fontSize: 12,
    letterSpacing: -0.2
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10
  },
  countText: {
    fontSize: 10,
    fontWeight: '700'
  }
});
