import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function CustomerDashboardScreen({ customer, onBack, onLogout, onSelectPastBooking }) {
  const pastBookings = [
    { id: 'BK-1001', trade: 'plumbing', tradeName: 'Plumber', worker: 'Venkat Rao', date: 'Yesterday', amount: 849, status: 'COMPLETED' },
    { id: 'BK-1002', trade: 'electrical', tradeName: 'Electrician', worker: 'K. Shiva Kumar', date: '22 Sep 2026', amount: 899, status: 'COMPLETED' },
    { id: 'BK-1003', trade: 'masonry', tradeName: 'Mason', worker: 'Ramesh Reddy', date: '15 Sep 2026', amount: 1045, status: 'COMPLETED' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account & History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{customer?.name || 'Ravi Kumar'}</Text>
            <Text style={styles.phone}>+91 {customer?.phone || '9876543210'}</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedBadge}>100% UIDAI Verified ✓</Text>
            </View>
          </View>
        </View>

        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletLeft}>
            <Text style={styles.walletLabel}>KaamDost Wallet</Text>
            <Text style={styles.walletAmount}>₹100<Text style={styles.walletBonus}> (Bonus)</Text></Text>
          </View>
          <TouchableOpacity
            style={styles.addMoneyBtn}
            onPress={() => Alert.alert('Add Funds', 'Instant UPI top-up enabled.')}
          >
            <Text style={styles.addMoneyText}>+ Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Address Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Default Service Address</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={styles.addressInfo}>
              <Text style={styles.addressType}>Home (Default)</Text>
              <Text style={styles.addressText}>Plot 42, Near Old Bus Stand Road, Sangareddy, Telangana - 502001</Text>
            </View>
          </View>
        </View>

        {/* Past Bookings History */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Past Bookings History</Text>
          {pastBookings.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.bookingItem}
              onPress={() => onSelectPastBooking && onSelectPastBooking(b)}
            >
              <View style={styles.bookingIcon}>
                <Text style={styles.bIconEmoji}>🛠️</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTrade}>{b.tradeName} • {b.worker}</Text>
                <Text style={styles.bookingDate}>{b.date} • {b.id}</Text>
              </View>
              <View style={styles.bookingRight}>
                <Text style={styles.bookingAmount}>₹{b.amount}</Text>
                <Text style={styles.bookingStatus}>Completed ✓</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out of KaamDost</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.small
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  avatarEmoji: {
    fontSize: 28
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  phone: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  verifiedRow: {
    marginTop: 6
  },
  verifiedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
    backgroundColor: COLORS.accentLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    ...SHADOWS.medium
  },
  walletLeft: {},
  walletLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  walletAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textWhite,
    marginTop: 2
  },
  walletBonus: {
    fontSize: 12,
    color: COLORS.primarySoft,
    fontWeight: '600'
  },
  addMoneyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  addMoneyText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 12
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2
  },
  addressInfo: {
    flex: 1
  },
  addressType: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  bookingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  bIconEmoji: {
    fontSize: 16
  },
  bookingInfo: {
    flex: 1
  },
  bookingTrade: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  bookingDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  bookingRight: {
    alignItems: 'flex-end'
  },
  bookingAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary
  },
  bookingStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2
  },
  logoutBtn: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5'
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '800',
    fontSize: 14
  }
});
