import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerHeader({
  partnerName = 'Ramesh Reddy',
  trade = 'Mason',
  isOnline = true,
  onToggleDuty,
  onOpenNotifications,
  onOpenEarnings
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        <Text style={styles.brandTitle}>
          Kaam<Text style={styles.brandAccent}>Dost</Text> <Text style={styles.partnerBadge}>PARTNER</Text>
        </Text>
        <Text style={styles.partnerInfo}>
          👷 {partnerName} • <Text style={styles.tradeText}>{trade}</Text>
        </Text>
      </View>

      <View style={styles.rightCol}>
        {/* Duty Status Badge / Toggle */}
        <TouchableOpacity
          style={[styles.dutyPill, isOnline ? styles.dutyOnline : styles.dutyOffline]}
          onPress={onToggleDuty}
          activeOpacity={0.8}
        >
          <View style={[styles.dot, isOnline ? styles.dotOnline : styles.dotOffline]} />
          <Text style={[styles.dutyText, isOnline ? styles.dutyTextOnline : styles.dutyTextOffline]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onOpenNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium
  },
  leftCol: {
    flex: 1
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -0.5
  },
  brandAccent: {
    color: COLORS.primary
  },
  partnerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  partnerInfo: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4
  },
  tradeText: {
    color: COLORS.primarySoft,
    fontWeight: '700'
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dutyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1
  },
  dutyOnline: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: COLORS.onlineGreen
  },
  dutyOffline: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderColor: COLORS.border
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  dotOnline: {
    backgroundColor: COLORS.onlineGreen
  },
  dotOffline: {
    backgroundColor: COLORS.offlineGray
  },
  dutyText: {
    fontSize: 11,
    fontWeight: '800'
  },
  dutyTextOnline: {
    color: COLORS.onlineGreen
  },
  dutyTextOffline: {
    color: COLORS.textMuted
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 16
  }
});
