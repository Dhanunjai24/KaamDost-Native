import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { COLORS, SHADOWS } from '../shared/theme/theme';

export default function AdminDashboardScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis', 'kyc', 'dispatches', 'ai'
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>KaamDost Ops & Admin</Text>
          <Text style={styles.headerSub}>Telangana Regional Mission Console</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveDot}>●</Text>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'kpis' && styles.tabBtnActive]}
          onPress={() => setActiveTab('kpis')}
        >
          <Text style={[styles.tabText, activeTab === 'kpis' && styles.tabTextActive]}>KPIs & Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'kyc' && styles.tabBtnActive]}
          onPress={() => setActiveTab('kyc')}
        >
          <Text style={[styles.tabText, activeTab === 'kyc' && styles.tabTextActive]}>
            KYC Queue ({kycQueue.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ai' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ai')}
        >
          <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>AI Engine</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'kpis' && (
          <View>
            {/* KPI Cards Grid */}
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Total Registered Users</Text>
                <Text style={styles.kpiVal}>14,820</Text>
                <Text style={styles.kpiGrowth}>↑ +12.4% this week</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Active Labour Partners</Text>
                <Text style={styles.kpiVal}>2,410</Text>
                <Text style={styles.kpiGrowth}>Across 40 Telangana cities</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Completed Dispatches</Text>
                <Text style={styles.kpiVal}>8,940</Text>
                <Text style={styles.kpiGrowth}>Avg dispatch time: 48s</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Total Platform GMV</Text>
                <Text style={styles.kpiVal}>₹84.9 Lakhs</Text>
                <Text style={styles.kpiGrowth}>Zero worker commission cut</Text>
              </View>
            </View>

            {/* Telangana Regional Breakdown */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Top Active Districts</Text>
              <View style={styles.districtRow}>
                <Text style={styles.districtName}>1. Sangareddy</Text>
                <Text style={styles.districtCount}>840 Workers • 98% Online</Text>
              </View>
              <View style={styles.districtRow}>
                <Text style={styles.districtName}>2. Hyderabad & Secunderabad</Text>
                <Text style={styles.districtCount}>720 Workers • 96% Online</Text>
              </View>
              <View style={styles.districtRow}>
                <Text style={styles.districtName}>3. Medak & Vikarabad</Text>
                <Text style={styles.districtCount}>460 Workers • 94% Online</Text>
              </View>
              <View style={styles.districtRow}>
                <Text style={styles.districtName}>4. Warangal & Hanamkonda</Text>
                <Text style={styles.districtCount}>390 Workers • 92% Online</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'kyc' && (
          <View>
            <Text style={styles.sectionTitle}>Aadhaar & Trade Verification Queue</Text>
            {kycQueue.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>✅</Text>
                <Text style={styles.emptyTitle}>All KYC Applications Cleared</Text>
                <Text style={styles.emptySub}>No pending partner registrations in review queue.</Text>
              </View>
            ) : (
              kycQueue.map((item) => (
                <View key={item.id} style={styles.kycCard}>
                  <View style={styles.kycHeader}>
                    <View>
                      <Text style={styles.kycName}>{item.name}</Text>
                      <Text style={styles.kycTrade}>{item.trade} • {item.city}</Text>
                    </View>
                    <View style={styles.kycBadge}>
                      <Text style={styles.kycBadgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.kycMeta}>
                    <Text style={styles.kycPhone}>📞 +91 {item.phone}</Text>
                    <Text style={styles.kycAadhaar}>🛡️ Aadhaar: {item.aadhaar}</Text>
                  </View>

                  <View style={styles.kycActions}>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectKyc(item.id)}>
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.approveBtn} onPress={() => approveKyc(item.id)}>
                      <Text style={styles.approveText}>Approve & Activate ✓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'ai' && (
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View style={styles.aiTitleCol}>
                <Text style={styles.aiTitle}>KaamDost AI Demand & Match Engine</Text>
                <Text style={styles.aiSub}>Real-time geospatial labour allocation</Text>
              </View>
            </View>

            <View style={styles.aiMetricsRow}>
              <View style={styles.aiBox}>
                <Text style={styles.aiVal}>99.4%</Text>
                <Text style={styles.aiLbl}>Match Accuracy</Text>
              </View>
              <View style={styles.aiBox}>
                <Text style={styles.aiVal}>42s</Text>
                <Text style={styles.aiLbl}>Median Dispatch</Text>
              </View>
              <View style={styles.aiBox}>
                <Text style={styles.aiVal}>0.2%</Text>
                <Text style={styles.aiLbl}>Dispute Rate</Text>
              </View>
            </View>

            <Text style={styles.algoDesc}>
              Algorithm uses Euclidean nearest-neighbour routing, verified skill taxonomy weighting, and language affinity (Telugu, Hindi, English) to minimize dispatch delays and maximize customer satisfaction.
            </Text>
          </View>
        )}
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
    backgroundColor: COLORS.secondary,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backBtn: {
    paddingRight: 10
  },
  backText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textWhite
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textWhite
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.primarySoft
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  liveDot: {
    color: COLORS.danger,
    fontSize: 8,
    marginRight: 4
  },
  liveText: {
    color: COLORS.danger,
    fontSize: 10,
    fontWeight: '800'
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800'
  },
  content: {
    padding: 16
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
  },
  kpiCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  kpiVal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondary,
    marginVertical: 4
  },
  kpiGrowth: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  districtName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  districtCount: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  kycCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 10,
    ...SHADOWS.small
  },
  kycHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  kycName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  kycTrade: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary
  },
  kycBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  kycBadgeText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '700'
  },
  kycMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10
  },
  kycPhone: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  kycAadhaar: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  kycActions: {
    flexDirection: 'row',
    gap: 8
  },
  rejectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2'
  },
  rejectText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700'
  },
  approveBtn: {
    flex: 1,
    backgroundColor: COLORS.onlineGreen,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  approveText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '800'
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  aiCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight
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
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary
  },
  aiSub: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12
  },
  aiBox: {
    flex: 1,
    alignItems: 'center'
  },
  aiVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark
  },
  aiLbl: {
    fontSize: 10,
    color: COLORS.primaryDark,
    marginTop: 2
  },
  algoDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18
  }
});
