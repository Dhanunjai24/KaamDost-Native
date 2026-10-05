import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassSearch({
  value,
  onChangeText,
  placeholder = 'Search trades, workers, locations...',
  onVoicePress,
  onClear,
  style,
  inputStyle
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.border
        },
        shadows.small,
        style
      ]}
    >
      <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.textPrimary }, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))} style={styles.iconBtn}>
          <Text style={[styles.clearIcon, { color: theme.textMuted }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
      {onVoicePress ? (
        <TouchableOpacity onPress={onVoicePress} style={styles.voiceBtn} activeOpacity={0.7}>
          <Text style={[styles.voiceIcon, { color: theme.accentPrimary }]}>🎙️</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 3
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8
  },
  iconBtn: {
    padding: 6
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: '700'
  },
  voiceBtn: {
    padding: 6,
    marginLeft: 2
  },
  voiceIcon: {
    fontSize: 16
  }
});
