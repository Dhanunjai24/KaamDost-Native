import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/theme/theme';

export default function HelpModal({ visible, onClose }) {
  const faqs = [
    { q: 'How does KaamDost determine wages?', a: 'All daily rates adhere strictly to the Telangana Labour Department minimum daily wage standards.' },
    { q: 'How are workers verified?', a: 'Workers undergo 100% Aadhaar biometric/document verification, phone verification, and trade skill assessment.' },
    { q: 'What is the cancellation policy?', a: 'Cancellations within 3 minutes of booking are 100% free with no cancellation penalty.' },
    { q: 'Is there emergency support?', a: 'Yes! Our Telangana regional operations desk is available 24/7 with instant emergency SOS escalation.' }
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support Center</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Emergency SOS Banner */}
          <View style={styles.sosCard}>
            <Text style={styles.sosIcon}>🚨</Text>
            <View style={styles.sosInfo}>
              <Text style={styles.sosTitle}>Telangana Helpline & SOS</Text>
              <Text style={styles.sosSub}>Tap to connect with 24/7 support hotline</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.callBtnText}>Call 1800</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Support Actions */}
          <Text style={styles.sectionHeader}>Instant Help Topics</Text>
          <View style={styles.topicsGrid}>
            <TouchableOpacity style={styles.topicCard}>
              <Text style={styles.topicIcon}>💬</Text>
              <Text style={styles.topicTitle}>Live AI Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topicCard}>
              <Text style={styles.topicIcon}>💰</Text>
              <Text style={styles.topicTitle}>Billing & Refunds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topicCard}>
              <Text style={styles.topicIcon}>🛡️</Text>
              <Text style={styles.topicTitle}>Safety & Labour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topicCard}>
              <Text style={styles.topicIcon}>📜</Text>
              <Text style={styles.topicTitle}>Terms & Policies</Text>
            </TouchableOpacity>
          </View>

          {/* FAQs */}
          <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
          {faqs.map((f, i) => (
            <View key={i} style={styles.faqCard}>
              <Text style={styles.faqQuestion}>{f.q}</Text>
              <Text style={styles.faqAnswer}>{f.a}</Text>
            </View>
          ))}
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
    padding: 16
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 20
  },
  sosIcon: {
    fontSize: 24,
    marginRight: 10
  },
  sosInfo: {
    flex: 1
  },
  sosTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.danger
  },
  sosSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  callBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  callBtnText: {
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: 12
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  topicCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center'
  },
  topicIcon: {
    fontSize: 22,
    marginBottom: 6
  },
  topicTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  faqCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 10
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18
  }
});
