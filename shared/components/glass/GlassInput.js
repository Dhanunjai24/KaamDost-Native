import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassInput({
  label,
  error,
  icon,
  rightElement,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  maxLength,
  multiline,
  numberOfLines,
  style,
  inputStyle,
  editable = true,
  ...rest
}) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.glassSurface,
            borderColor: error
              ? theme.danger
              : isFocused
              ? theme.accentPrimary
              : theme.border
          }
        ]}
      >
        {icon ? <View style={styles.iconBox}>{icon}</View> : null}

        <TextInput
          style={[
            styles.input,
            { color: theme.textPrimary },
            multiline && { minHeight: (numberOfLines || 3) * 22, textAlignVertical: 'top' },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {rightElement ? <View style={styles.rightBox}>{rightElement}</View> : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : null}
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
    marginBottom: 6,
    letterSpacing: -0.2
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 2
  },
  iconBox: {
    marginRight: 8
  },
  rightBox: {
    marginLeft: 8
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10
  },
  errorText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500'
  }
});
