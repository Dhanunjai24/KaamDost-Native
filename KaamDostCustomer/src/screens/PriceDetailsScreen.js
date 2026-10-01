import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PriceDetailsScreen({
  service,
  onBack,
  onProceedToBook,
}) {
  const bill = {
    serviceAmount: 999,
    additionalCharges: 100,
    discount: 50,
    gst: 188,
    totalAmount: 1237,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_15 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price Details</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Bill Breakdown Card matching screen_15 */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Service Amount</Text>
            <Text style={styles.itemValue}>₹{bill.serviceAmount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.itemLabel}>Additional Charges</Text>
            <Text style={styles.itemValue}>₹{bill.additionalCharges}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.itemLabel}>Discount</Text>
            <Text style={styles.discountValue}>-₹{bill.discount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.itemLabel}>GST (18%)</Text>
            <Text style={styles.itemValue}>₹{bill.gst}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{bill.totalAmount}</Text>
          </View>
        </View>

        {/* Proceed to Book CTA matching screen_15 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={() => onProceedToBook && onProceedToBook(bill)}
            activeOpacity={0.88}
          >
            <Text style={styles.proceedBtnText}>Proceed to Book</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f294a',
  },
  discountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  footer: {
    paddingTop: 10,
  },
  proceedBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
