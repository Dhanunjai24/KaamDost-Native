import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ActiveJobCard({ job, onStatusChange, onOpenChat }) {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!job) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>☕</Text>
        <Text style={styles.emptyTitle}>No Active Job Right Now</Text>
        <Text style={styles.emptyDesc}>
          Stay online to get nearby bookings. New customer requests will ring with an alert.
        </Text>
      </View>
    );
  }

  const handleStartWork = () => {
    if (enteredOtp.trim() !== (job.startOtp || '4829')) {
      Alert.alert('Incorrect OTP', 'Please request the 4-digit start OTP shown on customer screen.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onStatusChange('STARTED');
    }, 600);
  };

  return (
    <View style={styles.card}>
      {/* Top Banner */}
      <View style={styles.topRow}>
        <View style={styles.tradeBadge}>
          <Text style={styles.tradeText}>{job.tradeName || 'Mason Work'}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>● {job.status}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.customerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.custName}>{job.customerName || 'Ravi Kumar'}</Text>
          <Text style={styles.custPhone}>📞 +91 {job.customerPhone || '9876543210'}</Text>
          <Text style={styles.custAddr} numberOfLines={1}>📍 {job.address || 'Sangareddy'}</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn} onPress={onOpenChat}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Action by state */}
      {job.status === 'ARRIVING' && (
        <View style={styles.actionsContainer}>
          <View style={styles.otpInputBox}>
            <Text style={styles.otpLabel}>Ask Customer for 4-Digit Start OTP:</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="e.g. 4829"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => Alert.alert('Navigation', 'Opening Google Maps navigation to customer address.')}
            >
              <Text style={styles.navBtnText}>🗺️ Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStartWork}
              disabled={isVerifying}
            >
              <Text style={styles.startBtnText}>
                {isVerifying ? 'Verifying...' : '⚡ Verify & Start Work'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {job.status === 'STARTED' && (
        <View style={styles.actionsContainer}>
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>⚡ Work is currently in progress...</Text>
            <Text style={styles.timerText}>Duration: 1 Day • Wage: ₹{job.dailyRate || 950}</Text>
          </View>

          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => onStatusChange('COMPLETED')}
          >
            <Text style={styles.completeBtnText}>✅ Mark Work Completed & Request Pay</Text>
          </TouchableOpacity>
        </View>
      )}

      {job.status === 'COMPLETED' && (
        <View style={styles.actionsContainer}>
          <View style={styles.completedBox}>
            <Text style={styles.completedTitle}>Job Completed Successfully! 🎉</Text>
            <Text style={styles.completedSub}>Payment of ₹{job.dailyRate || 950} credited to today’s ledger.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primarySoft,
    ...SHADOWS.medium
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  tradeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  tradeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  statusBadge: {
    backgroundColor: '#ecfeff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0891b2'
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarEmoji: {
    fontSize: 24
  },
  customerInfo: {
    flex: 1
  },
  custName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  custPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1
  },
  custAddr: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatIcon: {
    fontSize: 18
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12
  },
  otpInputBox: {
    marginBottom: 10
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 6
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 4
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary
  },
  startBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  startBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  progressBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  progressText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  timerText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    marginTop: 2
  },
  completeBtn: {
    backgroundColor: COLORS.onlineGreen,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  completeBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  completedBox: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803d'
  },
  completedSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18
  }
});
