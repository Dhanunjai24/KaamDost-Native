import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { STATUS_LABELS } from '../../../shared/constants/states';
import { t } from '../../../shared/i18n';

export default function ActiveBookingCard({ booking, onTrackBooking }) {
  if (!booking) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBg}>
          <Text style={styles.emptyIcon}>📋</Text>
        </View>
        <Text style={styles.emptyTitle}>{t('noActiveBooking')}</Text>
        <Text style={styles.emptyDesc}>
          Need a mason, plumber, or electrician today? Tap below to find verified workers ready for immediate dispatch.
        </Text>
      </View>
    );
  }

  const statusConfig = STATUS_LABELS[booking.status] || {
    label: booking.status,
    color: COLORS.primary,
    bg: COLORS.primaryLight
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.tradeBadge}>
          <Text style={styles.tradeText}>{booking.tradeName || 'Skilled Labour'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            ● {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.workerRow}>
        <View style={styles.workerAvatar}>
          <Text style={styles.avatarEmoji}>👷</Text>
        </View>
        <View style={styles.workerDetails}>
          <Text style={styles.workerName}>{booking.workerName || 'Assigned Partner'}</Text>
          <Text style={styles.workerMeta}>
            ⭐ {booking.workerRating || '4.8'} • Arriving in {booking.estimatedArrival || '15 mins'}
          </Text>
        </View>
        <View style={styles.otpBox}>
          <Text style={styles.otpLabel}>Start OTP</Text>
          <Text style={styles.otpValue}>{booking.startOtp || '3912'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => onTrackBooking(booking)}
        activeOpacity={0.8}
      >
        <Text style={styles.trackButtonText}>Live Tracking & Worker Details →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    ...SHADOWS.medium
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  tradeBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  tradeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700'
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarEmoji: {
    fontSize: 22
  },
  workerDetails: {
    flex: 1
  },
  workerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  workerMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  otpBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center'
  },
  otpLabel: {
    fontSize: 9,
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  otpValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1
  },
  trackButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  trackButtonText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700'
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  emptyIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  emptyIcon: {
    fontSize: 24
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18
  }
});
