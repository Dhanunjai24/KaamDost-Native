import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';

export default function DutyToggle({ isOnline, onToggle }) {
  const { theme, shadows } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.banner,
          {
            backgroundColor: isOnline ? theme.successLight : theme.glassSurfaceStrong,
            borderColor: isOnline ? theme.success : theme.border
          },
          shadows.glass
        ]}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{isOnline ? '🟢' : '⚪'}</Text>
        </View>

        <View style={styles.textCol}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {isOnline ? 'You Are Online & Dispatch Ready' : 'You Are Offline'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isOnline
              ? 'Receiving job notifications within 15 km in Sangareddy'
              : 'Tap here to go online and receive immediate customer bookings'}
          </Text>
        </View>

        <View
          style={[
            styles.switchTrack,
            {
              backgroundColor: isOnline ? theme.success : theme.borderLight,
              borderColor: isOnline ? theme.success : theme.border,
              borderWidth: 1
            }
          ]}
        >
          <View
            style={[
              styles.switchThumb,
              {
                backgroundColor: '#FFFFFF',
                alignSelf: isOnline ? 'flex-end' : 'flex-start'
              }
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.2
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  iconEmoji: {
    fontSize: 20
  },
  textCol: {
    flex: 1,
    paddingRight: 8
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15
  },
  switchTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center'
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10
  }
});
