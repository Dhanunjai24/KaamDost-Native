import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function EarningsCard({
  todayEarnings = 1900,
  completedJobs = 2,
  walletBalance = 3850,
  onRequestPayout
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Today's Completed Earnings</Text>
          <Text style={styles.amount}>₹{todayEarnings}</Text>
        </View>
        <TouchableOpacity style={styles.payoutBtn} onPress={onRequestPayout}>
          <Text style={styles.payoutText}>⚡ Instant Payout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{completedJobs}</Text>
          <Text style={styles.statLbl}>Jobs Today</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>₹{walletBalance}</Text>
          <Text style={styles.statLbl}>Withdrawable</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>0%</Text>
          <Text style={styles.statLbl}>Fee / Cut</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.medium
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  amount: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
    marginTop: 2
  },
  payoutBtn: {
    backgroundColor: COLORS.onlineGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12
  },
  payoutText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '800'
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primarySoft
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)'
  }
});
