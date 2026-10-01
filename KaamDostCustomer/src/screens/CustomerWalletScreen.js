import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerWalletScreen({ onBack }) {
  const [balance, setBalance] = useState(2500);

  const transactions = [
    {
      id: 'tx_1',
      title: 'Booking Payment',
      date: '26 Apr 2025',
      amount: '-₹1,237',
      isDebit: true,
      icon: '🛍️',
    },
    {
      id: 'tx_2',
      title: 'Wallet Credit',
      date: '20 Apr 2025',
      amount: '+₹500',
      isDebit: false,
      icon: '💰',
    },
    {
      id: 'tx_3',
      title: 'Referral Bonus',
      date: '15 Apr 2025',
      amount: '+₹100',
      isDebit: false,
      icon: '🎁',
    },
  ];

  const handleAddMoney = () => {
    Alert.alert('Add Funds', 'Instant UPI top-up enabled. Add ₹500 to wallet?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add ₹500',
        onPress: () => setBalance((prev) => prev + 500),
      },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert('Withdraw Funds', 'Transfer available balance to bank account via UPI?');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_23 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Balance Card matching screen_23 */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>

            {/* Action Buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.addMoneyBtn}
                onPress={handleAddMoney}
                activeOpacity={0.88}
              >
                <Text style={styles.btnEmoji}>➕</Text>
                <Text style={styles.addMoneyText}>Add Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.withdrawBtn}
                onPress={handleWithdraw}
                activeOpacity={0.8}
              >
                <Text style={styles.btnEmoji}>📤</Text>
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Transactions Section matching screen_23 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Recent Transactions</Text>
            <View style={styles.txList}>
              {transactions.map((tx) => (
                <View key={tx.id} style={styles.txItem}>
                  <View style={styles.txLeft}>
                    <View
                      style={[
                        styles.txIconBox,
                        tx.isDebit ? styles.debitBox : styles.creditBox,
                      ]}
                    >
                      <Text style={styles.txEmoji}>{tx.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.txAmount,
                      tx.isDebit ? styles.debitAmount : styles.creditAmount,
                    ]}
                  >
                    {tx.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0f294a',
    letterSpacing: -0.5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  addMoneyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 6,
    ...SHADOWS.buttonGlow,
  },
  btnEmoji: {
    fontSize: 14,
  },
  addMoneyText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  withdrawBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 6,
  },
  withdrawText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '800',
  },
  section: {},
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 12,
  },
  txList: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debitBox: {
    backgroundColor: '#fee2e2',
  },
  creditBox: {
    backgroundColor: '#ecfdf5',
  },
  txEmoji: {
    fontSize: 20,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  txDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  debitAmount: {
    color: '#0f294a',
  },
  creditAmount: {
    color: '#10b981',
  },
});
