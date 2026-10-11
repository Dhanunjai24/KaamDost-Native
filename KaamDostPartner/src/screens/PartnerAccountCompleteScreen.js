import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function PartnerAccountCompleteScreen({ lang = 'te', partner, onProceedDashboard }) {
  const isTe = lang === 'te';

  const checklist = [
    {
      title: isTe ? 'మొబైల్ నంబర్ ధృవీకరించబడింది' : 'Mobile Number Verified',
      desc: '+91 ' + (partner?.phone || ''),
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '📱'
    },
    {
      title: isTe ? 'పార్ట్‌నర్ ప్రొఫైల్ & వయస్సు నమోదైంది' : 'Partner Profile & Age Registered',
      desc: (partner?.name || (isTe ? 'పార్ట్‌నర్' : 'Partner')),
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '👤'
    },
    {
      title: isTe ? 'ప్రధాన వృత్తి & రోజువారీ వేతనం సెటప్' : 'Primary Trade & Rate Configured',
      desc: (partner?.tradeName || (isTe ? 'మేస్త్రీ' : 'Mason')) + ' • ₹' + (partner?.dailyRate || 950) + (isTe ? '/రోజు' : '/day'),
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '🔨'
    },
    {
      title: isTe ? 'సర్వీస్ లొకేషన్ సేవ్ చేయబడింది' : 'Service Base Location Saved',
      desc: (partner?.city || (isTe ? 'సంగారెడ్డి' : 'Sangareddy')) + (isTe ? ' (15 కి.మీ పరిధి)' : ' (15 km radius)'),
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '📍'
    },
    {
      title: isTe ? 'ఆధార్ e-KYC ధృవీకరించబడింది' : 'Aadhaar e-KYC Verified',
      desc: partner?.aadhaarMasked || 'XXXX-XXXX-1234',
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '🛡️'
    },
    {
      title: isTe ? 'లైవ్ ఫోటో & బ్యాంక్ ఖాతా లింక్ చేయబడింది' : 'Live Photo & Bank Account Verified',
      desc: isTe ? '18+ ధృవీకరించబడింది • తక్షణ చెల్లింపులు యాక్టివ్' : '18+ Adult Confirmed • Instant Payouts Active',
      status: isTe ? 'ధృవీకరించబడింది' : 'Verified',
      icon: '📸'
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F4F8FC' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>{isTe ? 'దశ 6 / 6' : 'Step 6 of 6'}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>

          {/* Trophy Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.trophy}>🎉</Text>
            </View>
            <Text style={styles.title}>
              {isTe ? 'పార్ట్‌నర్ ఖాతా 100% పూర్తయింది!' : 'Partner Setup 100% Complete!'}
            </Text>
            <Text style={styles.subtext}>
              {isTe
                ? 'మీ ధృవీకరించబడిన బ్యాడ్జ్ యాక్టివ్ చేయబడింది. సమీపంలోని పనులను పొందడానికి మీరు సిద్ధంగా ఉన్నారు.'
                : 'Your verified badge is active. You are now ready to receive nearby daily jobs.'}
            </Text>
          </View>

          {/* 6-Point Verification Checklist */}
          <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>
              {isTe ? 'ధృవీకరించబడిన వివరాలు (6/6)' : 'Verified Onboarding Checklist (6/6)'}
            </Text>
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
                <Text style={styles.benefitTitle}>
                  {isTe ? 'ప్రత్యక్ష బ్యాంక్ చెల్లింపులు' : 'Direct Bank Payouts'}
                </Text>
                <Text style={styles.benefitDesc}>
                  {isTe
                    ? 'ప్రభుత్వ ఇ-శ్రమ్ నిబంధనల ప్రకారం రోజువారీ వేతనం నేరుగా మీ UPI/బ్యాంక్ ఖాతాలో జమ చేయబడుతుంది.'
                    : 'Daily wages credited to your UPI/Bank with SAC 998599 government e-Shram compliance.'}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Start Duty Button */}
          <View style={styles.footer}>
            <GlassButton
              title={isTe ? 'పార్ట్‌నర్ డ్యాష్‌బోర్డ్‌కు వెళ్లండి →' : 'Go to Partner Dashboard →'}
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
  title: { fontSize: 22, fontWeight: '800', color: '#0B2341', textAlign: 'center' },
  subtext: { fontSize: 12, color: '#48627D', marginTop: 6, textAlign: 'center', lineHeight: 18 },
  card: { padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0B2341', marginBottom: 14 },
  list: { gap: 14 },
  checkItem: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#0B2341' },
  itemDesc: { fontSize: 11, color: '#48627D', marginTop: 2 },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  earningsCard: { padding: 16, marginBottom: 16, backgroundColor: 'rgba(23, 63, 107, 0.08)', borderColor: 'rgba(23, 63, 107, 0.20)' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitIcon: { fontSize: 26 },
  benefitContent: { flex: 1 },
  benefitTitle: { fontSize: 14, fontWeight: '700', color: '#0B2341' },
  benefitDesc: { fontSize: 11, color: '#48627D', marginTop: 2, lineHeight: 16 },
  footer: { marginTop: 4 }
});
