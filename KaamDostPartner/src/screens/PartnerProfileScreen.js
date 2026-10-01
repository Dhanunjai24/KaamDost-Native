import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerProfileScreen({ partner, onBack, onLogout }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partner Profile & Badge</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👷</Text>
          </View>
          <Text style={styles.name}>{partner?.name || 'Ramesh Reddy'}</Text>
          <Text style={styles.trade}>{partner?.tradeName || 'Mason / Civil Work'}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Aadhaar Verified ✓</Text>
            </View>
            <View style={styles.starBadge}>
              <Text style={styles.starText}>⭐ 4.9 (142 Reviews)</Text>
            </View>
          </View>
        </View>

        {/* Operational Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>142</Text>
            <Text style={styles.statLbl}>Jobs Completed</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>99.2%</Text>
            <Text style={styles.statLbl}>Acceptance Rate</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹950</Text>
            <Text style={styles.statLbl}>Daily Rate</Text>
          </View>
        </View>

        {/* Banking Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Direct Payout Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>Linked Bank</Text>
            <Text style={styles.detailVal}>State Bank of India (SBI)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>Account No</Text>
            <Text style={styles.detailVal}>•••• •••• 9104</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>Registered UPI</Text>
            <Text style={styles.detailVal}>ramesh.reddy@sbi</Text>
          </View>
        </View>

        {/* Service Region */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service Territory</Text>
          <Text style={styles.regionText}>
            📍 Operating District: Sangareddy, Telangana. Dispatch radius: 15 km.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out from Partner App</Text>
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
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.small
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  avatarEmoji: {
    fontSize: 32
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.secondary
  },
  trade: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  verifiedBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  verifiedText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700'
  },
  starBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  starText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '700'
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  detailLbl: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  regionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18
  },
  logoutBtn: {
    marginTop: 8,
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
