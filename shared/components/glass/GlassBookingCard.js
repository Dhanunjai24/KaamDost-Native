import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import GlassButton from './GlassButton';
import GlassStatusBadge from './GlassStatusBadge';

export default function GlassBookingCard({
  booking,
  onTrackBooking,
  onNewBooking,
  style
}) {
  const { theme, shadows } = useTheme();

  if (!booking) {
    return (
      <View
        style={[
          styles.card,
          styles.emptyCard,
          {
            backgroundColor: theme.glassSurface,
            borderColor: theme.border
          },
          shadows.glass,
          style
        ]}
      >
        <View
          style={[
            styles.emptyIconBg,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.emptyIcon}>📋</Text>
        </View>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
          No Active Bookings Today
        </Text>
        <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
          Need a verified mason, plumber, electrician or helper? Tap below to match with nearby skilled workers.
        </Text>
        {onNewBooking ? (
          <GlassButton
            title="⚡ Book a Worker Now"
            onPress={onNewBooking}
            variant="primary"
            size="sm"
            style={{ marginTop: 12, minWidth: 160 }}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.borderStrong
        },
        shadows.medium,
        style
      ]}
    >
      {/* Top Row: Trade & Status */}
      <View style={styles.topRow}>
        <View style={[styles.tradePill, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.tradeText, { color: theme.textPrimary }]}>
            {booking.tradeName || 'Skilled Labour'}
          </Text>
        </View>
        <GlassStatusBadge status={booking.status || 'ARRIVING'} />
      </View>

      {/* Middle Row: Worker info & Start OTP */}
      <View style={styles.workerRow}>
        <View
          style={[
            styles.workerAvatar,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.avatarEmoji}>👷</Text>
        </View>

        <View style={styles.workerDetails}>
          <Text style={[styles.workerName, { color: theme.textPrimary }]}>
            {booking.workerName || 'Assigned Partner'}
          </Text>
          <Text style={[styles.workerMeta, { color: theme.textSecondary }]}>
            ⭐ {booking.workerRating || '4.8'} • {booking.estimatedArrival ? `Arriving in ${booking.estimatedArrival}` : 'On the way'}
          </Text>
        </View>

        {booking.startOtp ? (
          <View
            style={[
              styles.otpBox,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.border,
                borderWidth: 1
              }
            ]}
          >
            <Text style={[styles.otpLabel, { color: theme.textSecondary }]}>START OTP</Text>
            <Text style={[styles.otpValue, { color: theme.textPrimary }]}>
              {booking.startOtp}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Prominent Pricing Row */}
      <View
        style={[
          styles.rateSummaryRow,
          { borderTopColor: theme.borderLight }
        ]}
      >
        <View>
          <Text style={[styles.rateSub, { color: theme.textSecondary }]}>Daily Rate</Text>
          <Text style={[styles.rateBold, { color: theme.textPrimary }]}>
            ₹{booking.dailyRate || 950}
          </Text>
        </View>
        <View style={styles.alignRight}>
          <Text style={[styles.rateSub, { color: theme.textSecondary }]}>Total Amount</Text>
          <Text style={[styles.rateBold, { color: theme.textPrimary }]}>
            ₹{booking.totalAmount || booking.dailyRate || 1045}
          </Text>
        </View>
      </View>

      {/* Bottom CTA */}
      <GlassButton
        title="Live Tracking & Worker Details →"
        onPress={() => onTrackBooking && onTrackBooking(booking)}
        variant="primary"
        size="md"
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  tradePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  tradeText: {
    fontSize: 13,
    fontWeight: '800'
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  workerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  workerMeta: {
    fontSize: 12,
    marginTop: 2
  },
  otpBox: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center'
  },
  otpLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  otpValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1
  },
  rateSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4
  },
  rateSub: {
    fontSize: 11
  },
  rateBold: {
    fontSize: 16,
    fontWeight: '800'
  },
  alignRight: {
    alignItems: 'flex-end'
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24
  },
  emptyIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  emptyIcon: {
    fontSize: 26
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260
  }
});
