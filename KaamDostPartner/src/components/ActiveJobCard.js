import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function ActiveJobCard({ job, onStatusChange, onOpenChat }) {
  const { theme, shadows } = useTheme();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!job) {
    return (
      <View
        style={[
          styles.emptyCard,
          {
            backgroundColor: theme.glassSurface,
            borderColor: theme.border
          },
          shadows.glass
        ]}
      >
        <Text style={styles.emptyIcon}>☕</Text>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
          No Active Job Right Now
        </Text>
        <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
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
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.borderStrong
        },
        shadows.medium
      ]}
    >
      {/* Top Banner */}
      <View style={styles.topRow}>
        <View style={[styles.tradeBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.tradeText, { color: theme.textPrimary }]}>
            {job.tradeName || 'Mason Work'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.statusText, { color: theme.accentPrimary }]}>
            ● {job.status}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.customerRow}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={[styles.custName, { color: theme.textPrimary }]}>
            {job.customerName || 'Ravi Kumar'}
          </Text>
          <Text style={[styles.custPhone, { color: theme.textSecondary }]}>
            📞 +91 {job.customerPhone || '9876543210'}
          </Text>
          <Text style={[styles.custAddr, { color: theme.textSecondary }]} numberOfLines={1}>
            📍 {job.address || 'Sangareddy'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.chatBtn,
            {
              backgroundColor: theme.glassSurface,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
          onPress={onOpenChat}
          activeOpacity={0.7}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Action by state */}
      {job.status === 'ARRIVING' && (
        <View style={[styles.actionsContainer, { borderTopColor: theme.borderLight }]}>
          <View style={styles.otpInputBox}>
            <Text style={[styles.otpLabel, { color: theme.textPrimary }]}>
              Ask Customer for 4-Digit Start OTP:
            </Text>
            <TextInput
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.accentPrimary,
                  color: theme.textPrimary
                }
              ]}
              placeholder="e.g. 4829"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => Alert.alert('Navigation', 'Opening navigation to customer location.')}
              activeOpacity={0.75}
            >
              <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>
                🗺️ Navigate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleStartWork}
              disabled={isVerifying}
              activeOpacity={0.85}
            >
              <Text style={styles.startBtnText}>
                {isVerifying ? 'Verifying...' : '⚡ Verify & Start Work'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {job.status === 'STARTED' && (
        <View style={[styles.actionsContainer, { borderTopColor: theme.borderLight }]}>
          <View style={[styles.progressBox, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.progressText, { color: theme.textPrimary }]}>
              ⚡ Work is currently in progress...
            </Text>
            <Text style={[styles.timerText, { color: theme.textSecondary }]}>
              Duration: 1 Day • Wage: ₹{job.dailyRate || 950}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.completeBtn, { backgroundColor: theme.buttonPrimary }]}
            onPress={() => onStatusChange('COMPLETED')}
            activeOpacity={0.85}
          >
            <Text style={styles.completeBtnText}>
              ✅ Mark Work Completed & Request Pay
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {job.status === 'COMPLETED' && (
        <View style={[styles.actionsContainer, { borderTopColor: theme.borderLight }]}>
          <View style={[styles.completedBox, { backgroundColor: theme.successLight }]}>
            <Text style={[styles.completedTitle, { color: theme.success }]}>
              Job Completed Successfully! 🎉
            </Text>
            <Text style={[styles.completedSub, { color: theme.success }]}>
              Payment of ₹{job.dailyRate || 950} credited to today’s ledger.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  tradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  tradeText: {
    fontSize: 13,
    fontWeight: '800'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800'
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
    letterSpacing: -0.2
  },
  custPhone: {
    fontSize: 12,
    marginTop: 1
  },
  custAddr: {
    fontSize: 11,
    marginTop: 2
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatIcon: {
    fontSize: 18
  },
  actionsContainer: {
    borderTopWidth: 1,
    paddingTop: 12
  },
  otpInputBox: {
    marginBottom: 10
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6
  },
  otpInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '800'
  },
  startBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  progressBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  progressText: {
    fontSize: 13,
    fontWeight: '800'
  },
  timerText: {
    fontSize: 11,
    marginTop: 2
  },
  completeBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  completedBox: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  completedSub: {
    fontSize: 11,
    marginTop: 2
  },
  emptyCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18
  }
});
