import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function PartnerAccountCompleteScreen({ partner, onProceedDashboard }) {
  const checklist = [
    { title: 'Mobile Number Verified', desc: '+91 ' + (partner?.phone || '9848012345'), status: 'Verified', icon: '📱' },
    { title: 'Partner Profile & Age Registered', desc: (partner?.name || 'Ramesh Reddy') + ' (32 yrs)', status: 'Verified', icon: '👤' },
    { title: 'Primary Trade & Rate Configured', desc: (partner?.tradeName || 'Mason') + ' • ₹' + (partner?.dailyRate || 950) + '/day', status: 'Verified', icon: '🔨' },
    { title: 'Service Base Location Saved', desc: (partner?.city || 'Sangareddy') + ' (15 km radius)', status: 'Verified', icon: '📍' },
    { title: 'Aadhaar e-KYC Verified', desc: partner?.aadhaarMasked || 'XXXX-XXXX-1234', status: 'Verified', icon: '🛡️' },
    { title: 'Live Photo & Bank Account Verified', desc: '18+ Adult Confirmed • Instant Payouts Active', status: 'Verified', icon: '📸' }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B1320' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 6 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>

          {/* Trophy Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.trophy}>🎉</Text>
            </View>
            <Text style={styles.title}>Partner Setup 100% Complete!</Text>
            <Text style={styles.subtitle}>పార్ట్‌నర్ ఖాతా సక్సెస్ ఫుల్ గా వెరిఫై అయింది</Text>
            <Text style={styles.subtext}>Your verified badge is active. You are now ready to receive nearby daily jobs.</Text>
          </View>

          {/* 6-Point Verification Checklist */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>Verified Onboarding Checklist (6/6)</Text>
            <View style={styles.list}>
              {checklist.map((item, idx) => (
                <View key={idx} style={styles.checkItem}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.badgeText}>✓ {item.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Earnings Guarantee Card */}
          <GlassCard style={styles.earningsCard}>
            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>💰</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Direct Bank Payouts</Text>
                <Text style={styles.benefitDesc}>Daily wages credited to your UPI/Bank with SAC 998599 government e-Shram compliance.</Text>
              </View>
            </View>
          </GlassCard>

          {/* Start Duty Button */}
          <View style={styles.footer}>
            <GlassButton
              title="Go to Partner Dashboard (డ్యూటీ ప్రారంభించండి) →"
              onPress={onProceedDashboard}
              variant="primary"
              size="large"
            />
          </View>
        </ScrollView>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#10B981', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  header: { alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  trophy: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#10B981', marginTop: 4, textAlign: 'center' },
  subtext: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'center', lineHeight: 18 },
  card: { padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 14 },
  list: { gap: 14 },
  checkItem: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  itemDesc: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  earningsCard: { padding: 16, marginBottom: 16, backgroundColor: 'rgba(255, 107, 0, 0.08)', borderColor: 'rgba(255, 107, 0, 0.25)' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitIcon: { fontSize: 26 },
  benefitContent: { flex: 1 },
  benefitTitle: { fontSize: 14, fontWeight: '700', color: '#FF8800' },
  benefitDesc: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2, lineHeight: 16 },
  footer: { marginTop: 4 }
});
