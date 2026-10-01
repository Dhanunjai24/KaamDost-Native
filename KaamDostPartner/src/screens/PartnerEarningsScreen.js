import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import PayoutModal from '../components/PayoutModal';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerEarningsScreen({ onBack }) {
  const [balance, setBalance] = useState(3850);
  const [showPayout, setShowPayout] = useState(false);

  const ledger = [
    { id: 'TX-101', title: 'Masonry Work (Ravi Kumar)', date: 'Today, 2:30 PM', amount: '+₹950', type: 'credit', status: 'Settled' },
    { id: 'TX-102', title: 'Floor Repair & Plastering', date: 'Today, 11:15 AM', amount: '+₹950', type: 'credit', status: 'Settled' },
    { id: 'TX-103', title: 'Instant UPI Payout to SBI', date: 'Yesterday', amount: '-₹1,900', type: 'debit', status: 'Success' },
    { id: 'TX-104', title: 'Customer Appreciation Tip', date: 'Yesterday', amount: '+₹100', type: 'credit', status: 'Settled' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings & Daily Ledger</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Withdrawable Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance}</Text>
          <Text style={styles.balanceSub}>Zero deductions • Direct daily bank transfer</Text>

          <TouchableOpacity style={styles.withdrawBtn} onPress={() => setShowPayout(true)}>
            <Text style={styles.withdrawBtnText}>⚡ Instant Withdrawal to UPI / Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Week's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.sumItem}>
              <Text style={styles.sumVal}>₹6,750</Text>
              <Text style={styles.sumLbl}>Total Earned</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.sumItem}>
              <Text style={styles.sumVal}>7</Text>
              <Text style={styles.sumLbl}>Jobs Done</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.sumItem}>
              <Text style={styles.sumVal}>₹250</Text>
              <Text style={styles.sumLbl}>Tips Received</Text>
            </View>
          </View>
        </View>

        {/* Ledger Transactions */}
        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerHeading}>Recent Ledger Transactions</Text>
          {ledger.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txIconBox, tx.type === 'credit' ? styles.txCredit : styles.txDebit]}>
                <Text style={styles.txIconText}>{tx.type === 'credit' ? '↓' : '↑'}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date} • {tx.id}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, tx.type === 'credit' ? styles.amountGreen : styles.amountDark]}>
                  {tx.amount}
                </Text>
                <Text style={styles.txStatus}>{tx.status} ✓</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <PayoutModal
        visible={showPayout}
        balance={balance}
        onClose={() => setShowPayout(false)}
        onSuccess={(amt) => setBalance(prev => Math.max(0, prev - amt))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  backBtn: {
    paddingRight: 8
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  content: {
    padding: 16
  },
  balanceCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    ...SHADOWS.medium
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textWhite,
    marginVertical: 4
  },
  balanceSub: {
    fontSize: 11,
    color: COLORS.onlineGreen,
    fontWeight: '700',
    marginBottom: 16
  },
  withdrawBtn: {
    backgroundColor: COLORS.onlineGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  withdrawBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sumItem: {
    flex: 1,
    alignItems: 'center'
  },
  sumVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  sumLbl: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight
  },
  ledgerSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  ledgerHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  txIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  txCredit: {
    backgroundColor: '#dcfce7'
  },
  txDebit: {
    backgroundColor: '#fee2e2'
  },
  txIconText: {
    fontSize: 14,
    fontWeight: '900'
  },
  txInfo: {
    flex: 1
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  txDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  txRight: {
    alignItems: 'flex-end'
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800'
  },
  amountGreen: {
    color: COLORS.onlineGreen
  },
  amountDark: {
    color: COLORS.secondary
  },
  txStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2
  }
});
