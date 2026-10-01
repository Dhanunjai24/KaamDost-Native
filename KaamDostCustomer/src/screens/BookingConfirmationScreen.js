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

export default function BookingConfirmationScreen({
  booking,
  onViewBookingDetails,
  onGoToHome,
}) {
  const currentBooking = booking || {
    id: 'KD123456',
    tradeName: 'Home Cleaning - Deep Cleaning',
    scheduledDate: '26 Apr 2025 • 10:00 AM',
    address: '123 Green Park, New Delhi',
    totalAmount: 1237,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_16 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onGoToHome} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Confirmation</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.content}>
          {/* Large Solid Green Checkmark Badge matching screen_16 */}
          <View style={styles.successIconCircle}>
            <Text style={styles.checkEmoji}>✓</Text>
          </View>

          {/* Booking ID Callout matching screen_16 */}
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingIdNumber}>{currentBooking.id || 'KD123456'}</Text>

          {/* Booking Summary Card matching screen_16 */}
          <View style={styles.summaryCard}>
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.rowIcon}>📅</Text>
              </View>
              <Text style={styles.rowText}>{currentBooking.tradeName}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.rowIcon}>⏱️</Text>
              </View>
              <Text style={styles.rowText}>{currentBooking.scheduledDate || '26 Apr 2025 • 10:00 AM'}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.rowIcon}>📍</Text>
              </View>
              <Text style={styles.rowText} numberOfLines={2}>
                {currentBooking.address || '123 Green Park, New Delhi'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Amount</Text>
              <Text style={styles.priceValue}>₹{currentBooking.totalAmount || 1237}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons matching screen_16 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onViewBookingDetails}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>View Booking Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onGoToHome}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Go to Home</Text>
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
    marginBottom: 16,
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.large,
    shadowColor: '#10b981',
    shadowOpacity: 0.35,
  },
  checkEmoji: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '900',
  },
  bookingIdLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  bookingIdNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
    marginBottom: 24,
    letterSpacing: 1,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: {
    fontSize: 16,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f294a',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  footer: {
    gap: 12,
    paddingTop: 10,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
  },
});
