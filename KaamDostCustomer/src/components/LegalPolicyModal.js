import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/theme/theme';

export default function LegalPolicyModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Legal & Compliance</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>Telangana Labour Welfare Board Compliant</Text>
          </View>

          <Text style={styles.h1}>Terms of Service</Text>
          <Text style={styles.p}>
            KaamDost operates as an on-demand marketplace connecting registered customers with independent, background-verified tradespeople and daily wage labourers across the state of Telangana.
          </Text>

          <Text style={styles.h1}>Fair Wage Guarantee</Text>
          <Text style={styles.p}>
            All daily wage minimums on KaamDost are pegged strictly to the current Telangana Labour Department schedules. Platform fees ensure insurance coverage and customer-worker dispute mediation.
          </Text>

          <Text style={styles.h1}>Identity & KYC Privacy</Text>
          <Text style={styles.p}>
            Aadhaar numbers and live selfies captured during onboarding are masked and encrypted using AES-256 standard encryption. No unmasked Aadhaar information is shared with unauthorized third parties.
          </Text>

          <Text style={styles.h1}>Cancellation & Refund Policy</Text>
          <Text style={styles.p}>
            Orders cancelled before worker departure or within 3 minutes of initial booking incur zero cancellation fees. If a worker fails to arrive, a full 100% immediate refund is provided.
          </Text>

          <TouchableOpacity style={styles.okBtn} onPress={onClose}>
            <Text style={styles.okText}>I Understand & Agree</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  content: {
    padding: 20
  },
  badgeRow: {
    marginBottom: 16
  },
  badge: {
    backgroundColor: COLORS.accentLight,
    color: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '700',
    fontSize: 12,
    alignSelf: 'flex-start'
  },
  h1: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 12,
    marginBottom: 6
  },
  p: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12
  },
  okBtn: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  okText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 14
  }
});
