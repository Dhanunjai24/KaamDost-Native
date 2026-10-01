import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PayoutModal({ visible, balance = 3850, onClose, onSuccess }) {
  const [upiId, setUpiId] = useState('ramesh.reddy@sbi');
  const [amount, setAmount] = useState(String(balance));
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    const val = Number(amount);
    if (!val || val <= 0 || val > balance) {
      Alert.alert('Invalid Amount', `Please enter an amount between ₹100 and ₹${balance}`);
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Payout Successful!', `₹${val} transferred to UPI ID: ${upiId} within 30 seconds.`);
      if (onSuccess) onSuccess(val);
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Instant Earnings Payout</Text>
            <Text style={styles.subtitle}>Direct UPI / Bank Transfer within 30s</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Withdrawable Balance</Text>
            <Text style={styles.balanceValue}>₹{balance}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Withdrawal Amount (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Registered UPI ID / VPA</Text>
            <TextInput
              style={styles.input}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="e.g. mobile@upi"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>⚡ 0% platform fee on all partner daily earnings withdrawals.</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleWithdraw} disabled={isProcessing}>
              <Text style={styles.confirmText}>
                {isProcessing ? 'Transferring...' : `Withdraw ₹${amount} Now`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14
  },
  header: {
    marginBottom: 14
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  balanceCard: {
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#86efac',
    alignItems: 'center',
    marginBottom: 16
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d'
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#166534',
    marginTop: 2
  },
  field: {
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  infoBox: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10
  },
  infoText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: COLORS.onlineGreen,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  confirmText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  }
});
