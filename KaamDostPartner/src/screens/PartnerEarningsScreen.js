import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import PayoutModal from '../components/PayoutModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function PartnerEarningsScreen({ onBack }) {
  const { theme, shadows } = useTheme();
  const [balance, setBalance] = useState(3850);
  const [showPayout, setShowPayout] = useState(false);

  const ledger = [
    { id: 'TX-101', title: 'Masonry Work (Ravi Kumar)', date: 'Today, 2:30 PM', amount: '+₹950', type: 'credit', status: 'Settled' },
    { id: 'TX-102', title: 'Floor Repair & Plastering', date: 'Today, 11:15 AM', amount: '+₹950', type: 'credit', status: 'Settled' },
    { id: 'TX-103', title: 'Instant UPI Payout to SBI', date: 'Yesterday', amount: '-₹1,900', type: 'debit', status: 'Success' },
    { id: 'TX-104', title: 'Customer Appreciation Tip', date: 'Yesterday', amount: '+₹100', type: 'credit', status: 'Settled' }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderBottomColor: theme.border
            },
            shadows.small
          ]}
        >
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Earnings & Daily Ledger
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Balance Card - Light Frosted Glass */}
          <GlassCard style={styles.balanceCard} variant="strong">
            <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
              Available Withdrawable Balance
            </Text>
            <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
              ₹{balance}
            </Text>
            <Text style={[styles.balanceSub, { color: theme.textSecondary }]}>
              Zero deductions • Direct daily bank transfer
            </Text>

            <GlassButton
              title="⚡ Instant Withdrawal to UPI / Bank"
              onPress={() => setShowPayout(true)}
              variant="primary"
              size="md"
              style={{ marginTop: 14 }}
            />
          </GlassCard>

          {/* Weekly Summary */}
          <GlassCard style={styles.summaryCard} variant="default">
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
              This Week's Summary
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.sumItem}>
                <Text style={[styles.sumVal, { color: theme.textPrimary }]}>₹6,750</Text>
                <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Total Earned</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.sumItem}>
                <Text style={[styles.sumVal, { color: theme.textPrimary }]}>7</Text>
                <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Jobs Done</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.sumItem}>
                <Text style={[styles.sumVal, { color: theme.textPrimary }]}>₹250</Text>
                <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Tips Received</Text>
              </View>
            </View>
          </GlassCard>

          {/* Ledger Transactions */}
          <GlassCard style={styles.ledgerSection} variant="default">
            <Text style={[styles.ledgerHeading, { color: theme.textPrimary }]}>
              Recent Ledger Transactions
            </Text>
            {ledger.map((tx) => (
              <View
                key={tx.id}
                style={[styles.txRow, { borderBottomColor: theme.borderLight }]}
              >
                <View
                  style={[
                    styles.txIconBox,
                    {
                      backgroundColor: tx.type === 'credit' ? theme.successLight : theme.primaryLight,
                      borderColor: theme.border,
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.txIconText,
                      { color: tx.type === 'credit' ? theme.success : theme.textPrimary }
                    ]}
                  >
                    {tx.type === 'credit' ? '↓' : '↑'}
                  </Text>
                </View>

                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: theme.textPrimary }]}>
                    {tx.title}
                  </Text>
                  <Text style={[styles.txDate, { color: theme.textSecondary }]}>
                    {tx.date} • {tx.id}
                  </Text>
                </View>

                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'credit' ? theme.success : theme.textPrimary }
                    ]}
                  >
                    {tx.amount}
                  </Text>
                  <Text style={[styles.txStatus, { color: theme.success }]}>
                    {tx.status} ✓
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </ScrollView>

        <PayoutModal
          visible={showPayout}
          balance={balance}
          onClose={() => setShowPayout(false)}
          onSuccess={(amt) => setBalance(prev => Math.max(0, prev - amt))}
        />
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 8,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '800'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  balanceCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 12
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
    letterSpacing: -0.5
  },
  balanceSub: {
    fontSize: 11
  },
  summaryCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sumItem: {
    flex: 1,
    alignItems: 'center'
  },
  sumVal: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  sumLbl: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600'
  },
  divider: {
    width: 1,
    height: 24
  },
  ledgerSection: {
    borderRadius: 20,
    padding: 16
  },
  ledgerHeading: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  txIconText: {
    fontSize: 18,
    fontWeight: '800'
  },
  txInfo: {
    flex: 1
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  txDate: {
    fontSize: 11,
    marginTop: 2
  },
  txRight: {
    alignItems: 'flex-end'
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '900'
  },
  txStatus: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  }
});
