import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';

export default function EarningsCard({
  todayEarnings = 1900,
  completedJobs = 2,
  walletBalance = 3850,
  onRequestPayout
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.borderStrong
        },
        shadows.medium
      ]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Today's Completed Earnings
          </Text>
          <Text style={[styles.amount, { color: theme.textPrimary }]}>
            ₹{todayEarnings}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payoutBtn, { backgroundColor: theme.buttonPrimary }]}
          onPress={onRequestPayout}
          activeOpacity={0.85}
        >
          <Text style={styles.payoutText}>⚡ Instant Payout</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.statsRow, { borderTopColor: theme.borderLight }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.textPrimary }]}>{completedJobs}</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Jobs Today</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.textPrimary }]}>₹{walletBalance}</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Withdrawable</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.success }]}>0%</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Fee / Cut</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    fontWeight: '700'
  },
  amount: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.5
  },
  payoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12
  },
  payoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  statLbl: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600'
  },
  divider: {
    width: 1,
    height: 22
  }
});
