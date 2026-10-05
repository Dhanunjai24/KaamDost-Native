import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useTheme } from '../shared/theme/ThemeContext';
import GlassBackground from '../shared/components/glass/GlassBackground';
import GlassCard from '../shared/components/glass/GlassCard';
import GlassButton from '../shared/components/glass/GlassButton';
import GlassTab from '../shared/components/glass/GlassTab';

export default function AdminDashboardScreen({ onBack }) {
  const { theme, shadows } = useTheme();
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis', 'kyc', 'ai'
  const [kycQueue, setKycQueue] = useState([
    { id: 'KYC-01', name: 'Naveen Chary', trade: 'Carpenter', phone: '9848011223', aadhaar: 'XXXX-XXXX-4912', city: 'Sangareddy', status: 'Pending Review' },
    { id: 'KYC-02', name: 'Md. Ismail', trade: 'Electrician', phone: '9848055667', aadhaar: 'XXXX-XXXX-9102', city: 'Patancheru', status: 'Pending Review' },
    { id: 'KYC-03', name: 'K. Raju', trade: 'Plumber', phone: '9848088990', aadhaar: 'XXXX-XXXX-3341', city: 'Hyderabad', status: 'Pending Review' }
  ]);

  const approveKyc = (id) => {
    Alert.alert('KYC Approved', `Worker ${id} verified and added to dispatch pool.`);
    setKycQueue(prev => prev.filter(k => k.id !== id));
  };

  const rejectKyc = (id) => {
    Alert.alert('KYC Rejected', `Worker ${id} documents marked incomplete.`);
    setKycQueue(prev => prev.filter(k => k.id !== id));
  };

  const tabs = [
    { id: 'kpis', label: 'KPIs & Stats' },
    { id: 'kyc', label: 'KYC Queue', count: kycQueue.length },
    { id: 'ai', label: 'AI Engine' }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Light Glassmorphic Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderBottomColor: theme.border
            },
            shadows.small
          ]}
        >
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              KaamDost Ops & Admin
            </Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              Telangana Regional Mission Console
            </Text>
          </View>
          <View
            style={[
              styles.liveBadge,
              { backgroundColor: theme.successLight, borderColor: theme.success, borderWidth: 1 }
            ]}
          >
            <Text style={[styles.liveDot, { color: theme.success }]}>●</Text>
            <Text style={[styles.liveText, { color: theme.success }]}>LIVE</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <GlassTab
            tabs={tabs}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'kpis' && (
            <View>
              {/* KPI Cards Grid */}
              <View style={styles.kpiGrid}>
                <GlassCard style={styles.kpiCard} variant="strong">
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Total Registered Users
                  </Text>
                  <Text style={[styles.kpiVal, { color: theme.textPrimary }]}>
                    14,820
                  </Text>
                  <Text style={[styles.kpiGrowth, { color: theme.success }]}>
                    ↑ +12.4% this week
                  </Text>
                </GlassCard>

                <GlassCard style={styles.kpiCard} variant="strong">
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Active Labour Partners
                  </Text>
                  <Text style={[styles.kpiVal, { color: theme.textPrimary }]}>
                    2,410
                  </Text>
                  <Text style={[styles.kpiGrowth, { color: theme.accentPrimary }]}>
                    Across 40 Telangana cities
                  </Text>
                </GlassCard>

                <GlassCard style={styles.kpiCard} variant="strong">
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Completed Dispatches
                  </Text>
                  <Text style={[styles.kpiVal, { color: theme.textPrimary }]}>
                    8,940
                  </Text>
                  <Text style={[styles.kpiGrowth, { color: theme.success }]}>
                    Avg dispatch time: 48s
                  </Text>
                </GlassCard>

                <GlassCard style={styles.kpiCard} variant="strong">
                  <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
                    Total Platform GMV
                  </Text>
                  <Text style={[styles.kpiVal, { color: theme.textPrimary }]}>
                    ₹84.9 Lakhs
                  </Text>
                  <Text style={[styles.kpiGrowth, { color: theme.accentPrimary }]}>
                    Zero worker commission cut
                  </Text>
                </GlassCard>
              </View>

              {/* Telangana Regional Breakdown */}
              <GlassCard style={styles.sectionCard} variant="default">
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Top Active Districts
                </Text>
                <View style={[styles.districtRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.districtName, { color: theme.textPrimary }]}>
                    1. Sangareddy
                  </Text>
                  <Text style={[styles.districtCount, { color: theme.textSecondary }]}>
                    840 Workers • 98% Online
                  </Text>
                </View>
                <View style={[styles.districtRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.districtName, { color: theme.textPrimary }]}>
                    2. Medak
                  </Text>
                  <Text style={[styles.districtCount, { color: theme.textSecondary }]}>
                    510 Workers • 95% Online
                  </Text>
                </View>
                <View style={[styles.districtRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.districtName, { color: theme.textPrimary }]}>
                    3. Hyderabad Urban
                  </Text>
                  <Text style={[styles.districtCount, { color: theme.textSecondary }]}>
                    620 Workers • 99% Online
                  </Text>
                </View>
                <View style={styles.districtRow}>
                  <Text style={[styles.districtName, { color: theme.textPrimary }]}>
                    4. Nizamabad
                  </Text>
                  <Text style={[styles.districtCount, { color: theme.textSecondary }]}>
                    440 Workers • 92% Online
                  </Text>
                </View>
              </GlassCard>
            </View>
          )}

          {activeTab === 'kyc' && (
            <View>
              {kycQueue.length === 0 ? (
                <GlassCard style={styles.emptyCard} variant="default">
                  <Text style={styles.emptyEmoji}>🎉</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                    KYC Verification Queue Clear
                  </Text>
                  <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                    All pending labour documents have been reviewed and verified.
                  </Text>
                </GlassCard>
              ) : (
                kycQueue.map((item) => (
                  <GlassCard key={item.id} style={styles.kycCard} variant="default">
                    <View style={styles.kycHeader}>
                      <View>
                        <Text style={[styles.kycName, { color: theme.textPrimary }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.kycTrade, { color: theme.accentPrimary }]}>
                          {item.trade} • {item.city}
                        </Text>
                      </View>
                      <View style={[styles.kycBadge, { backgroundColor: theme.warningLight }]}>
                        <Text style={[styles.kycBadgeText, { color: theme.warning }]}>
                          ● {item.status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.kycMeta,
                        { backgroundColor: theme.primaryLight, borderColor: theme.border, borderWidth: 1 }
                      ]}
                    >
                      <Text style={[styles.kycPhone, { color: theme.textPrimary }]}>
                        📞 {item.phone}
                      </Text>
                      <Text style={[styles.kycAadhaar, { color: theme.textPrimary }]}>
                        🪪 Aadhaar: {item.aadhaar}
                      </Text>
                    </View>

                    <View style={styles.kycActions}>
                      <TouchableOpacity
                        style={[styles.rejectBtn, { backgroundColor: theme.dangerLight }]}
                        onPress={() => rejectKyc(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.rejectText, { color: theme.danger }]}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.approveBtn, { backgroundColor: theme.buttonPrimary }]}
                        onPress={() => approveKyc(item.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.approveText}>Approve & Verify ✓</Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          )}

          {activeTab === 'ai' && (
            <GlassCard style={styles.aiCard} variant="strong">
              <View style={styles.aiHeader}>
                <Text style={styles.aiIcon}>🧠</Text>
                <View style={styles.aiTitleCol}>
                  <Text style={[styles.aiTitle, { color: theme.textPrimary }]}>
                    KaamDost AI Dispatch Core
                  </Text>
                  <Text style={[styles.aiSub, { color: theme.textSecondary }]}>
                    Autonomous worker matching & fare assurance
                  </Text>
                </View>
              </View>

              <View style={[styles.aiMetricsRow, { backgroundColor: theme.primaryLight }]}>
                <View style={styles.aiBox}>
                  <Text style={[styles.aiVal, { color: theme.textPrimary }]}>0.8s</Text>
                  <Text style={[styles.aiLbl, { color: theme.textSecondary }]}>Match Latency</Text>
                </View>
                <View style={styles.aiBox}>
                  <Text style={[styles.aiVal, { color: theme.textPrimary }]}>99.4%</Text>
                  <Text style={[styles.aiLbl, { color: theme.textSecondary }]}>Acceptance Rate</Text>
                </View>
                <View style={styles.aiBox}>
                  <Text style={[styles.aiVal, { color: theme.textPrimary }]}>1.2 km</Text>
                  <Text style={[styles.aiLbl, { color: theme.textSecondary }]}>Avg Radius</Text>
                </View>
              </View>

              <Text style={[styles.algoDesc, { color: theme.textSecondary }]}>
                The AI engine matches incoming customer requests to nearest available workers within 60 seconds, verifying daily rates against Telangana district wage benchmarks.
              </Text>
            </GlassCard>
          )}
        </ScrollView>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 10,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '800'
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  liveDot: {
    fontSize: 8,
    marginRight: 4
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10
  },
  kpiCard: {
    width: '48%',
    borderRadius: 18,
    padding: 14
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4,
    letterSpacing: -0.5
  },
  kpiGrowth: {
    fontSize: 10,
    fontWeight: '700'
  },
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.2
  },
  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  districtName: {
    fontSize: 13,
    fontWeight: '700'
  },
  districtCount: {
    fontSize: 11
  },
  kycCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 10
  },
  kycHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  kycName: {
    fontSize: 15,
    fontWeight: '800'
  },
  kycTrade: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  kycBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  kycBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  kycMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  kycPhone: {
    fontSize: 11,
    fontWeight: '600'
  },
  kycAadhaar: {
    fontSize: 11,
    fontWeight: '600'
  },
  kycActions: {
    flexDirection: 'row',
    gap: 8
  },
  rejectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10
  },
  rejectText: {
    fontSize: 12,
    fontWeight: '700'
  },
  approveBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center'
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  emptyCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center'
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  aiCard: {
    borderRadius: 20,
    padding: 18
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  aiIcon: {
    fontSize: 28,
    marginRight: 10
  },
  aiTitleCol: {
    flex: 1
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  aiSub: {
    fontSize: 11,
    marginTop: 2
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12
  },
  aiBox: {
    flex: 1,
    alignItems: 'center'
  },
  aiVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  aiLbl: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600'
  },
  algoDesc: {
    fontSize: 12,
    lineHeight: 18
  }
});
