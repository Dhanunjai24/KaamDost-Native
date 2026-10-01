import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerPaymentScreen({
  totalAmount = 1237,
  onBack,
  onPaymentSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handlePayNow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful!',
        `₹${totalAmount} paid securely via UPI. Thank you!`,
        [
          {
            text: 'Rate Worker',
            onPress: () => {
              if (onPaymentSuccess) onPaymentSuccess();
            },
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_22 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.content}>
          {/* UPI Payment Option Card matching screen_22 */}
          <View style={styles.paymentCard}>
            <View style={styles.upiIconBox}>
              <Text style={styles.upiEmoji}>📱</Text>
            </View>
            <View style={styles.upiTextCol}>
              <Text style={styles.upiTitle}>UPI Payment</Text>
              <Text style={styles.upiSub}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>
            <View style={styles.radioSelected}>
              <View style={styles.radioInner} />
            </View>
          </View>

          {/* Amount Summary Card matching screen_22 */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Footer with Pay Now and Security Badge matching screen_22 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePayNow}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.payBtnText}>Pay Now</Text>
            )}
          </TouchableOpacity>

          <View style={styles.securityBadge}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.securityText}>100% secure payment</Text>
          </View>
        </View>
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
    paddingBottom: 24,
    justifyContent: 'space-between',
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
  content: {
    gap: 16,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    ...SHADOWS.small,
  },
  upiIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  upiEmoji: {
    fontSize: 22,
  },
  upiTextCol: {
    flex: 1,
  },
  upiTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  upiSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  amountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f294a',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  footer: {
    gap: 16,
    alignItems: 'center',
  },
  payBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shieldIcon: {
    fontSize: 16,
  },
  securityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
  },
});
