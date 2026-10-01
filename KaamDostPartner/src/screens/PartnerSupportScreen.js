import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerSupportScreen({ onBack }) {
  const supportTopics = [
    { title: 'Payment Dispute Resolution', desc: 'Customer refused cash payment or incorrect hours', icon: '⚖️' },
    { title: 'Workplace Safety & SOS', desc: 'Medical emergency or site accident reporting', icon: '🚨' },
    { title: 'Insurance Claim Guidance', desc: '₹5 Lakh Telangana Labour insurance assistance', icon: '🛡️' },
    { title: 'Skill Upgrade & Certifications', desc: 'Telangana skill development board courses', icon: '🎓' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partner Helpline & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Emergency Call Card */}
        <View style={styles.sosCard}>
          <Text style={styles.sosIcon}>🚨</Text>
          <View style={styles.sosInfo}>
            <Text style={styles.sosTitle}>24/7 Telangana Labour Emergency Desk</Text>
            <Text style={styles.sosSub}>Immediate mediation & SOS medical escalation</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Alert.alert('Dialing Emergency', 'Calling 1800-KAAMDOST-SOS')}
          >
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Support Topics */}
        <Text style={styles.sectionHeader}>Partner Help Topics</Text>
        <View style={styles.topicsList}>
          {supportTopics.map((topic, i) => (
            <TouchableOpacity
              key={i}
              style={styles.topicCard}
              onPress={() => Alert.alert(topic.title, 'A dedicated officer will review your ticket within 15 minutes.')}
            >
              <View style={styles.topicIconBox}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc}>{topic.desc}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guideTitle}>Telangana Labour Protection Guidelines</Text>
          <Text style={styles.guideText}>• Never start work without verifying the 4-digit customer Start OTP.</Text>
          <Text style={styles.guideText}>• Full daily wage is guaranteed by KaamDost escrow once OTP is verified.</Text>
          <Text style={styles.guideText}>• In case of any harassment or dispute, tap Emergency SOS immediately.</Text>
        </View>
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
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16
  },
  sosIcon: {
    fontSize: 26,
    marginRight: 10
  },
  sosInfo: {
    flex: 1
  },
  sosTitle: {
    fontSize: 13,
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
    fontSize: 12,
    fontWeight: '800'
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  topicsList: {
    gap: 10,
    marginBottom: 16
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  topicIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  topicIcon: {
    fontSize: 18
  },
  topicInfo: {
    flex: 1
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  topicDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  arrow: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '700'
  },
  guidelinesCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8
  },
  guideText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 4
  }
});
