import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function AccountCompleteScreen({ customer, onProceedHome }) {
  const checklist = [
    { title: 'Mobile Number Verified', desc: '+91 ' + (customer?.phone || '9876543210'), status: 'Completed', icon: '📱' },
    { title: 'Full Name Registered', desc: customer?.name || 'Ravi Kumar', status: 'Completed', icon: '👤' },
    { title: 'Aadhaar Identity Verified', desc: customer?.maskedAadhaar || 'XXXX-XXXX-2345', status: 'Completed', icon: '🛡️' },
    { title: 'Service Address Saved', desc: 'Sangareddy, Telangana', status: 'Completed', icon: '📍' },
    { title: 'Live Selfie Matched', desc: '18+ Adult Status Confirmed', status: 'Completed', icon: '📸' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Success Trophy / Check Icon */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.trophy}>🎉</Text>
          </View>
          <Text style={styles.title}>Account Setup 100% Complete!</Text>
          <Text style={styles.subtitle}>
            Welcome to KaamDost. You are now verified to instantly book skilled labour across Telangana.
          </Text>
        </View>

        {/* Progress Bar (100%) */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>5 of 5 Verified</Text>
            <Text style={styles.progressPercent}>100%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.checklist}>
          {checklist.map((item, idx) => (
            <View key={idx} style={styles.checkItem}>
              <View style={styles.checkIcon}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified ✓</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Welcome Bonus Note */}
        <View style={styles.bonusBox}>
          <Text style={styles.bonusIcon}>🎁</Text>
          <View style={styles.bonusInfo}>
            <Text style={styles.bonusTitle}>₹100 Welcome Credit Active</Text>
            <Text style={styles.bonusSub}>Will be auto-applied on your first booking</Text>
          </View>
        </View>

        {/* Proceed to Home */}
        <TouchableOpacity style={styles.submitBtn} onPress={onProceedHome} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Explore Services & Book Dost →</Text>
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
  container: {
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  trophy: {
    fontSize: 32
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 10
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent
  },
  checklist: {
    gap: 10,
    marginBottom: 16
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  iconText: {
    fontSize: 18
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  itemDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  verifiedBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent
  },
  bonusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    marginBottom: 20
  },
  bonusIcon: {
    fontSize: 24,
    marginRight: 10
  },
  bonusInfo: {
    flex: 1
  },
  bonusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  bonusSub: {
    fontSize: 11,
    color: COLORS.primaryDark,
    opacity: 0.8
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.medium
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '800'
  }
});
