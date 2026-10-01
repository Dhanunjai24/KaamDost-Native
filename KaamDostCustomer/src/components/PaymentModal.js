import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function PaymentModal({ visible, amount = 1045, onClose, onSuccess }) {
  const [method, setMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        paymentId: 'PAY-' + Math.floor(Math.random() * 89999 + 10000),
        amount,
        method,
        timestamp: new Date().toISOString()
      });
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Secure Payment Checkout</Text>
            <Text style={styles.subtitle}>Telangana Worker Direct Settlement</Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Amount Due</Text>
            <Text style={styles.amountValue}>₹{amount}</Text>
          </View>

          <View style={styles.methodList}>
            <TouchableOpacity
              style={[styles.methodItem, method === 'upi' && styles.methodItemActive]}
              onPress={() => setMethod('upi')}
              activeOpacity={0.7}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>UPI (Google Pay, PhonePe, Paytm)</Text>
                <Text style={styles.methodSub}>Instant 0% transaction fee</Text>
              </View>
              {method === 'upi' && <Text style={styles.radio}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodItem, method === 'cash' && styles.methodItemActive]}
              onPress={() => setMethod('cash')}
              activeOpacity={0.7}
            >
              <Text style={styles.methodIcon}>💵</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Cash on Work Completion</Text>
                <Text style={styles.methodSub}>Hand cash directly to worker</Text>
              </View>
              {method === 'cash' && <Text style={styles.radio}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodItem, method === 'card' && styles.methodItemActive]}
              onPress={() => setMethod('card')}
              activeOpacity={0.7}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Credit / Debit Card</Text>
                <Text style={styles.methodSub}>Visa, MasterCard, RuPay</Text>
              </View>
              {method === 'card' && <Text style={styles.radio}>✓</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.securityBadge}>
            <Text style={styles.secIcon}>🔒</Text>
            <Text style={styles.secText}>256-Bit Encrypted & Escrow Protected</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={handlePay}
              disabled={isProcessing}
            >
              <Text style={styles.payBtnText}>
                {isProcessing ? 'Processing Payment...' : `Pay ₹${amount} Now`}
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
  amountBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2
  },
  methodList: {
    gap: 10,
    marginBottom: 16
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  methodItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface
  },
  methodIcon: {
    fontSize: 22,
    marginRight: 10
  },
  methodInfo: {
    flex: 1
  },
  methodName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  methodSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  radio: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  secIcon: {
    fontSize: 12,
    marginRight: 4
  },
  secText: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  footer: {
    flexDirection: 'row',
    gap: 10
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
  payBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  payBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  }
});
