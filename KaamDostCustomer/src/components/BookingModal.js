import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function BookingModal({ visible, trade, worker, onClose, onConfirmBooking }) {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState(1);
  const [urgency, setUrgency] = useState('instant'); // 'instant' or 'scheduled'
  const [workNotes, setWorkNotes] = useState('');
  const [address, setAddress] = useState('Plot 42, Near Municipal Office, Sangareddy');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dailyRate = worker?.dailyRate || trade?.dailyRate || 850;
  const subtotal = dailyRate * days;
  const platformFee = 49;
  const gst = Math.round(platformFee * 0.18);
  const total = subtotal + platformFee + gst;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking({
        trade: trade?.id || worker?.trade || 'masonry',
        tradeName: trade?.name || worker?.tradeName || 'Mason',
        workerId: worker?.id || null,
        workerName: worker?.name || 'Assigned Partner',
        workerPhone: worker?.phone || '9848012345',
        workerRating: worker?.rating || 4.9,
        days,
        dailyRate,
        totalAmount: total,
        address,
        workNotes,
        status: 'ARRIVING',
        startOtp: String(Math.floor(1000 + Math.random() * 9000)),
        estimatedArrival: '15 mins'
      });
      onClose();
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Book {trade?.name || worker?.name || 'Dost'}</Text>
            <Text style={styles.subtitle}>Telangana Labour Standard Daily Rate</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Step 1: Work Details */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Duration (Days)</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setDays(Math.max(1, days - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{days} Day{days > 1 ? 's' : ''}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setDays(days + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Urgency */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Dispatch Speed</Text>
              <View style={styles.urgencyRow}>
                <TouchableOpacity
                  style={[styles.urgencyBtn, urgency === 'instant' && styles.urgencyBtnActive]}
                  onPress={() => setUrgency('instant')}
                >
                  <Text style={[styles.urgencyText, urgency === 'instant' && styles.urgencyTextActive]}>
                    ⚡ Instant (Within 60s)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.urgencyBtn, urgency === 'scheduled' && styles.urgencyBtnActive]}
                  onPress={() => setUrgency('scheduled')}
                >
                  <Text style={[styles.urgencyText, urgency === 'scheduled' && styles.urgencyTextActive]}>
                    📅 Schedule Tomorrow
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Service Location</Text>
              <View style={styles.inputBox}>
                <Text style={styles.pin}>📍</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter full address"
                />
              </View>
            </View>

            {/* Work notes */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Describe Work (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={workNotes}
                onChangeText={setWorkNotes}
                placeholder="e.g. Bathroom tile replacement, ceiling wiring, etc."
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Price breakdown */}
            <View style={styles.billCard}>
              <Text style={styles.billTitle}>Cost Estimate</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Daily Wage (₹{dailyRate} × {days}d)</Text>
                <Text style={styles.billVal}>₹{subtotal}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Insurance & Platform Fee</Text>
                <Text style={styles.billVal}>₹{platformFee}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>GST (18%)</Text>
                <Text style={styles.billVal}>₹{gst}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.billRowTotal}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalVal}>₹{total}</Text>
              </View>
              <Text style={styles.guaranteeText}>🛡️ Pay after work completion with 100% satisfaction guarantee</Text>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              disabled={isSubmitting}
            >
              <Text style={styles.confirmText}>
                {isSubmitting ? 'Dispatching...' : `Confirm Booking • ₹${total}`}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%'
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14
  },
  header: {
    marginBottom: 14
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  section: {
    marginBottom: 14
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8
  },
  urgencyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  urgencyBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  urgencyTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10
  },
  pin: {
    fontSize: 16,
    marginRight: 6
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 8
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlignVertical: 'top'
  },
  billCard: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 8
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  billLabel: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  billVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  guaranteeText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 8
  },
  footer: {
    flexDirection: 'row',
    gap: 10
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  confirmText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  }
});
