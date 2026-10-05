import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import GlassBottomSheet from './GlassBottomSheet';

export default function GlassDropdown({
  label,
  value,
  options = [], // [{ label, value, icon, subtitle }]
  onSelect,
  placeholder = 'Select an option',
  style
}) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: theme.glassSurface,
            borderColor: isOpen ? theme.accentPrimary : theme.border
          }
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.valueText,
            { color: selectedOption ? theme.textPrimary : theme.textMuted }
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={[styles.arrow, { color: theme.textSecondary }]}>▾</Text>
      </TouchableOpacity>

      <GlassBottomSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || 'Select Option'}
      >
        <View style={styles.optionsList}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionRow,
                  {
                    backgroundColor: isSelected ? theme.primaryLight : 'transparent',
                    borderColor: theme.borderLight
                  }
                ]}
                onPress={() => {
                  onSelect(opt.value, opt);
                  setIsOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  {opt.icon && <Text style={styles.optionIcon}>{opt.icon}</Text>}
                  <View>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? theme.textPrimary : theme.textPrimary,
                          fontWeight: isSelected ? '800' : '600'
                        }
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {opt.subtitle && (
                      <Text style={[styles.optionSub, { color: theme.textSecondary }]}>
                        {opt.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
                {isSelected && (
                  <Text style={[styles.check, { color: theme.accentPrimary }]}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600'
  },
  arrow: {
    fontSize: 14
  },
  optionsList: {
    paddingBottom: 20
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
    marginBottom: 4
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 10
  },
  optionLabel: {
    fontSize: 14
  },
  optionSub: {
    fontSize: 11,
    marginTop: 2
  },
  check: {
    fontSize: 16,
    fontWeight: '800'
  }
});
