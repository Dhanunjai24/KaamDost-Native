import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function DutyToggle({ isOnline, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.banner, isOnline ? styles.bannerOnline : styles.bannerOffline]}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{isOnline ? '🟢' : '⚪'}</Text>
        </View>

        <View style={styles.textCol}>
          <Text style={styles.title}>
            {isOnline ? 'You Are Online & Dispatch Ready' : 'You Are Offline'}
          </Text>
          <Text style={styles.subtitle}>
            {isOnline
              ? 'Receiving job notifications within 15 km in Sangareddy'
              : 'Tap here to go online and receive immediate customer bookings'}
          </Text>
        </View>

        <View style={[styles.switchTrack, isOnline && styles.switchTrackActive]}>
          <View style={[styles.switchThumb, isOnline && styles.switchThumbActive]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 10
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    ...SHADOWS.small
  },
  bannerOnline: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac'
  },
  bannerOffline: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderLight
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
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center'
  },
  switchTrackActive: {
    backgroundColor: COLORS.onlineGreen
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surface
  },
  switchThumbActive: {
    alignSelf: 'flex-end'
  }
});
