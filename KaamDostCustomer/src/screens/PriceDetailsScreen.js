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
  quote,
  pricingQuote,
  priceBreakdown,
  bill: customBill,
  onBack,
  onProceedToBook,
}) {
  // Authoritative Customer Breakdown: Customer Price = Backend Pricing + Applicable Charges
  // Strictly excludes worker payout, internal margins, or platform commission
  const activeQuote = quote || pricingQuote || (service && service.pricing) || null;
  const breakdown = activeQuote?.breakdown || priceBreakdown || activeQuote || {};

  const serviceAmount = Number(breakdown.serviceAmount ?? breakdown.adjustedLabour ?? breakdown.baseLabour ?? 999);
  const travelFee = Number(breakdown.travelFee ?? activeQuote?.travel?.travelFee ?? 0);
  const materialsTotal = Number(breakdown.materialsTotal ?? activeQuote?.materials?.materialsTotal ?? 0);
  const additionalCharges = Number(breakdown.additionalCharges ?? (travelFee + materialsTotal) ?? 100);
  const discount = Number(breakdown.promoDiscount ?? breakdown.discount ?? 0);
  const gst = Number(breakdown.gst?.totalGST ?? breakdown.gst ?? Math.round((serviceAmount + additionalCharges) * 0.18));
  const totalAmount = Number(
    breakdown.finalPayable ??
    breakdown.totalAmount ??
    customBill?.totalAmount ??
    Math.max(0, serviceAmount + additionalCharges + gst - discount)
  );

  const bill = customBill || {
    serviceAmount,
    additionalCharges,
    travelFee,
    materialsTotal,
    discount,
    gst,
    totalAmount,
    quoteId: activeQuote?.quoteId || null,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header matching screen_15 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price Details</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Breakdown Card: Frosted card with clean pricing line items */}
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
            <Text style={styles.discountValue}>- ₹{bill.discount}</Text>
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

        {/* Primary CTA: "Proceed to Book" button */}
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
    backgroundColor: '#f0f6ff',
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
    paddingVertical: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.md,
    gap: 16,
    marginVertical: 'auto',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5f7da6',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  discountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16a34a',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(226, 232, 240, 0.7)',
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
    color: '#0f2c6e',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f2c6e',
  },
  footer: {
    paddingTop: 10,
  },
  proceedBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryBtn,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
