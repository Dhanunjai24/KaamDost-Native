import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function JobRequestModal({ visible, job, onAccept, onDecline }) {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    let interval;
    if (visible) {
      setSecondsLeft(30);
      interval = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(interval);
            onDecline();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible]);

  if (!job) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Alert */}
          <View style={styles.header}>
            <View style={styles.alertIcon}>
              <Text style={styles.bellEmoji}>🚨</Text>
            </View>
            <View style={styles.alertTitleCol}>
              <Text style={styles.alertTitle}>New Job Request!</Text>
              <Text style={styles.alertSub}>Immediate customer dispatch</Text>
            </View>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{secondsLeft}s</Text>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.detailsBox}>
            <View style={styles.tradeRow}>
              <Text style={styles.tradeName}>{job.tradeName || 'Mason / Civil Work'}</Text>
              <View style={styles.wageBadge}>
                <Text style={styles.wageText}>₹{job.dailyRate || 950} / day</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Customer Location</Text>
                <Text style={styles.infoValue}>{job.address || 'Balaji Nagar, Sangareddy (1.4 km)'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Duration & Urgency</Text>
                <Text style={styles.infoValue}>1 Day • Instant Dispatch</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📝</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Work Description</Text>
                <Text style={styles.infoValue}>{job.workNotes || 'Bathroom tile repair and wall plastering work'}</Text>
              </View>
            </View>
          </View>

          {/* Guaranteed Pay */}
          <View style={styles.payoutCard}>
            <Text style={styles.payoutLabel}>Guaranteed Minimum Pay</Text>
            <Text style={styles.payoutAmount}>₹{job.dailyRate || 950}</Text>
            <Text style={styles.payoutNote}>🛡️ Zero commission deduction • Direct daily bank transfer</Text>
          </View>

          {/* Accept / Decline CTAs */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(job)}>
              <Text style={styles.acceptText}>⚡ Accept Job ({secondsLeft}s)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.large
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  bellEmoji: {
    fontSize: 22
  },
  alertTitleCol: {
    flex: 1
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary
  },
  alertSub: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  timerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '900'
  },
  detailsBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  tradeName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary
  },
  wageBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  wageText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2
  },
  infoCol: {
    flex: 1
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1
  },
  payoutCard: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#86efac',
    alignItems: 'center',
    marginBottom: 16
  },
  payoutLabel: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '700'
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#166534',
    marginVertical: 2
  },
  payoutNote: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '600'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10
  },
  declineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  declineText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700'
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.onlineGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  acceptText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  }
});
