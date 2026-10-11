import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PartnerHeader from '../components/PartnerHeader';
import EarningsCard from '../components/EarningsCard';
import ActiveJobCard from '../components/ActiveJobCard';
import PayoutModal from '../components/PayoutModal';
import ChatModal from '../components/ChatModal';
import JobRequestModal from '../components/JobRequestModal';
import SosModal from '../../../shared/components/sos/SosModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';
import { useNotifications } from '../../../shared/services/notificationService';
import realtimeService from '../../../shared/services/realtimeService';

export default function PartnerDashboardScreen({
  partner,
  onLogout
}) {
  const { theme, themeId, switchTheme } = useTheme();
  const partnerId = partner?.id || partner?.workerId || 'worker_demo';
  const {
    notifications,
    unreadCount,
    refresh: refreshNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications({ userId: partnerId, role: 'worker' });

  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [rating, setRating] = useState(partner?.rating ? String(partner.rating) : '0.0');
  const [reviewsCount, setReviewsCount] = useState(partner?.reviewsCount || 0);
  const [walletBalance, setWalletBalance] = useState(partner?.walletBalance || 0);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
const [showThemeModal, setShowThemeModal] = useState(false);
  const [jobFilter, setJobFilter] = useState('ALL');
  const [showSosModal, setShowSosModal] = useState(false);

  const [activeJob, setActiveJob] = useState(null);
  const [incomingJobRequest, setIncomingJobRequest] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  // Sync with realtime gateway when partner is online
  useEffect(() => {
    if (isOnline) {
      realtimeService.connect({
        userId: partnerId,
        role: 'worker',
        trade: partner?.trade || 'all'
      });

      const unsubAlert = realtimeService.on('new_booking_alert', (booking) => {
        console.log('[PartnerDashboard] Received new_booking_alert:', booking);
        setIncomingJobRequest(booking);
        setShowJobModal(true);
      });

      const unsubCancel = realtimeService.on('booking_cancelled', () => {
        setShowJobModal(false);
        setIncomingJobRequest(null);
        setActiveJob(null);
        Alert.alert('Booking Cancelled', 'The customer cancelled this booking request.');
      });

      return () => {
        unsubAlert();
        unsubCancel();
      };
    } else {
      realtimeService.disconnect();
    }
  }, [isOnline, partnerId, partner?.trade]);

  const jobsList = [];

  const ledgerTransactions = [];

  const themesSummary = [
    { id: 'light_navy', name: 'Light + Navy Blue', subtitle: 'Cool white & Royal navy typography', bg: '#F4F8FC', primary: '#0B2341' },
    { id: 'white_teal', name: 'White + Deep Teal', subtitle: 'Fresh mint & Authoritative teal', bg: '#F6FBFA', primary: '#073B3A' },
    { id: 'ivory_indigo', name: 'Soft Ivory + Deep Indigo', subtitle: 'Warm ivory & Aristocratic indigo', bg: '#FAF9F6', primary: '#25234A' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    refreshNotifications();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleToggleDuty = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    Alert.alert(
      nextState ? 'Duty Activated 🟢' : 'Duty Deactivated ⚪',
      nextState
        ? 'You are now online to receive task alerts in Sangareddy.'
        : 'You are offline. No new job alerts will be received.'
    );
  };

  const handleAcceptJobRequest = (job) => {
    setShowJobModal(false);
    if (!job) return;

    const workerDetails = {
      id: partnerId,
      name: partner?.name || 'Assigned Partner',
      phone: partner?.phone || '9848012345',
      trade: partner?.trade || job.trade || 'masonry',
      tradeName: job.tradeName || 'Mason / Civil Work',
      rating: rating || '4.9',
      dailyRate: job.dailyRate || partner?.dailyRate || 950
    };

    realtimeService.acceptBooking(job.id, partnerId, workerDetails);

    const active = {
      ...job,
      status: 'ARRIVING',
      partnerDetails: workerDetails
    };
    setActiveJob(active);
    setIncomingJobRequest(null);
    Alert.alert('Job Accepted! 🚀', `Dispatched to ${job.address || 'Customer Location'}. Please proceed to the site.`);
  };

  const handleDeclineJobRequest = () => {
    setShowJobModal(false);
    setIncomingJobRequest(null);
  };

  const handleJobStatusChange = (newStatus) => {
    if (activeJob?.id) {
      realtimeService.send({
        type: 'UPDATE_JOB_STATUS',
        bookingId: activeJob.id,
        status: newStatus
      });
    }

    if (newStatus === 'COMPLETED') {
      const earned = activeJob?.dailyRate || 950;
      setActiveJob(null);
      setTodayEarnings(prev => prev + earned);
      setWalletBalance(prev => prev + earned);
      setCompletedJobsCount(prev => prev + 1);
      Alert.alert('Payment Received! 💰', `₹${earned} credited to your earnings.`);
    } else {
      setActiveJob(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleNavSelect = (id) => {
    if (id === 'trades') setActiveTab('jobs');
    else if (id === 'duty' || id === 'toggleDuty' || id === 'book') handleToggleDuty();
    else setActiveTab(id);
  };

  const filteredJobs = jobsList.filter(j => {
    if (jobFilter === 'AVAILABLE') return j.status === 'AVAILABLE' || j.status === 'INCOMING';
    if (jobFilter === 'COMPLETED') return j.status === 'COMPLETED';
    return true;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Top Header */}
        <PartnerHeader
          partnerName={partner?.name || 'PARTNER'}
          rating={rating}
          isOnline={isOnline}
          unreadCount={unreadCount}
          onOpenNotifications={() => setShowNotifications(true)}
onOpenEarnings={() => setActiveTab('wallet')}
          onOpenSos={() => setShowSosModal(true)}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary || '#0B2341'}
              colors={[theme.primary || '#0B2341']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <View>
              {/* Today's Earnings Card */}
              <EarningsCard
                todayEarnings={todayEarnings}
                onRequestPayout={() => setShowPayoutModal(true)}
              />

              {/* Active Job / Incoming Lead Card */}
              <ActiveJobCard
                job={activeJob}
                onStatusChange={handleJobStatusChange}
                onOpenChat={() => setShowChat(true)}
              />

              {/* 3-Column Metrics Card */}
              <View style={styles.metricsWrapper}>
                <View
                  style={[
                    styles.metricsCard,
                    {
                      backgroundColor: 'rgba(26, 38, 57, 0.72)',
                      borderColor: 'rgba(255, 255, 255, 0.16)'
                    }
                  ]}
                >
                  <View style={styles.metricCol}>
                    <View style={styles.metricIconBox}>
                      <Text style={styles.metricIcon}>☑️</Text>
                    </View>
                    <Text style={styles.metricLabel}>Completed Jobs</Text>
                    <Text style={styles.metricVal}>({completedJobsCount})</Text>
                  </View>

                  <View style={styles.verticalDivider} />

                  <View style={styles.metricCol}>
                    <View style={styles.metricIconBox}>
                      <Text style={styles.metricIcon}>🕒</Text>
                    </View>
                    <Text style={styles.metricLabel}>Hours Worked</Text>
                    <Text style={styles.metricVal}>({hoursWorked}h)</Text>
                  </View>

                  <View style={styles.verticalDivider} />

                  <View style={styles.metricCol}>
                    <View style={styles.metricIconBox}>
                      <Text style={styles.metricIcon}>⭐</Text>
                    </View>
                    <Text style={styles.metricLabel}>Rating</Text>
                    <Text style={styles.metricVal}>
                      {rating} <Text style={{ color: '#F59E0B' }}>★</Text>
                    </Text>
                    <Text style={styles.reviewSub}>{reviewsCount} Reviews</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: JOBS */}
          {activeTab === 'jobs' && (
            <View style={styles.tabSection}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                Tasks & Job Leads
              </Text>
              <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                Live tasks available in Sangareddy & nearby Telangana hubs
              </Text>

              {/* Filter Pills */}
              <View style={styles.filterRow}>
                {['ALL', 'AVAILABLE', 'COMPLETED'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: jobFilter === f ? (theme.primary || '#0B2341') : (theme.glassSurface || 'rgba(255,255,255,0.7)'),
                        borderColor: jobFilter === f ? (theme.primary || '#0B2341') : (theme.border || 'rgba(11,35,65,0.12)')
                      }
                    ]}
                    onPress={() => setJobFilter(f)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: jobFilter === f ? '#FFFFFF' : theme.textSecondary }
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Jobs Cards List */}
              {filteredJobs.length === 0 ? (
                <View style={{ paddingVertical: 28, alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, marginBottom: 10 }}>📋</Text>
                  <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: '700' }}>No Task Leads Available</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center' }}>Keep duty ON to receive instant customer job dispatches.</Text>
                </View>
              ) : (
                filteredJobs.map((j) => (
                <GlassCard key={j.id} style={styles.jobItemCard} variant="strong">
                  <View style={styles.jobItemHeader}>
                    <View style={styles.jobTitleBox}>
                      <Text style={styles.jobToolEmoji}>🔨</Text>
                      <View>
                        <Text style={[styles.jobItemTitle, { color: theme.textPrimary }]}>{j.tradeName}</Text>
                        <Text style={[styles.jobItemLoc, { color: theme.textSecondary }]}>📍 {j.location}</Text>
                      </View>
                    </View>
                    <View style={[styles.rateBadge, { backgroundColor: theme.primaryLight || 'rgba(23,63,107,0.1)', borderColor: theme.borderStrong || 'rgba(11,35,65,0.2)' }]}>
                      <Text style={[styles.rateText, { color: theme.primary || '#0B2341' }]}>₹{j.dailyRate}/day</Text>
                    </View>
                  </View>

                  <View style={styles.jobItemFooter}>
                    <Text style={[styles.jobMetaText, { color: theme.textSecondary }]}>
                      📍 {j.distance} • {j.time}
                    </Text>
                    {j.status === 'COMPLETED' ? (
                      <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22C55E' }]}>
                        <Text style={{ color: '#22C55E', fontWeight: '800', fontSize: 12 }}>Completed ✓</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.acceptBtnSmall, { backgroundColor: theme.buttonPrimary || '#0B2341' }]}
                        onPress={() => {
                          setActiveJob({
                            ...j,
                            status: 'ARRIVING',
                            address: j.location
                          });
                          setActiveTab('home');
                          Alert.alert('Task Accepted!', `Accepted ${j.tradeName}. Returning to Home.`);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.acceptBtnSmallText}>Accept Task</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </GlassCard>
              )))}
            </View>
          )}

          {/* TAB 3: WALLET & EARNINGS */}
          {activeTab === 'wallet' && (
            <View style={styles.tabSection}>
              {/* Balance Card */}
              <GlassCard style={styles.balanceCard} variant="strong">
                <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
                  Available Withdrawable Balance
                </Text>
                <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
                  ₹{walletBalance}
                </Text>
                <Text style={[styles.balanceSub, { color: theme.textSecondary }]}>
                  Zero deductions • Direct daily bank transfer
                </Text>

                <GlassButton
                  title="⚡ Instant Withdrawal to UPI / Bank"
                  onPress={() => setShowPayoutModal(true)}
                  variant="primary"
                  size="md"
                  style={{ marginTop: 14 }}
                />
              </GlassCard>

              {/* Weekly Summary */}
              <GlassCard style={styles.summaryCard} variant="default">
                <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
                  This Week's Summary
                </Text>
                <View style={styles.summaryRow}>
                  <View style={styles.sumItem}>
                    <Text style={[styles.sumVal, { color: theme.textPrimary }]}>₹0</Text>
                    <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Total Earned</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
                  <View style={styles.sumItem}>
                    <Text style={[styles.sumVal, { color: theme.textPrimary }]}>0</Text>
                    <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Jobs Done</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
                  <View style={styles.sumItem}>
                    <Text style={[styles.sumVal, { color: theme.textPrimary }]}>₹0</Text>
                    <Text style={[styles.sumLbl, { color: theme.textSecondary }]}>Tips Received</Text>
                  </View>
                </View>
              </GlassCard>

              {/* Ledger Transactions */}
              <GlassCard style={styles.ledgerSection} variant="default">
                <Text style={[styles.ledgerHeading, { color: theme.textPrimary }]}>
                  Recent Ledger Transactions
                </Text>
                {ledgerTransactions.length === 0 ? (
                  <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 13 }}>No wallet transactions recorded yet.</Text>
                  </View>
                ) : (
                  ledgerTransactions.map((tx) => (
                  <View key={tx.id} style={[styles.txRow, { borderBottomColor: theme.borderLight }]}>
                    <View
                      style={[
                        styles.txIconBox,
                        {
                          backgroundColor: tx.type === 'credit' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          borderColor: theme.border,
                          borderWidth: 1
                        }
                      ]}
                    >
                      <Text style={[styles.txIconText, { color: tx.type === 'credit' ? '#22C55E' : '#EF4444' }]}>
                        {tx.type === 'credit' ? '↓' : '↑'}
                      </Text>
                    </View>

                    <View style={styles.txInfo}>
                      <Text style={[styles.txTitle, { color: theme.textPrimary }]}>{tx.title}</Text>
                      <Text style={[styles.txDate, { color: theme.textSecondary }]}>
                        {tx.date} • {tx.id}
                      </Text>
                    </View>

                    <View style={styles.txRight}>
                      <Text style={[styles.txAmount, { color: tx.type === 'credit' ? '#22C55E' : theme.textPrimary }]}>
                        {tx.amount}
                      </Text>
                      <Text style={[styles.txStatus, { color: '#22C55E' }]}>{tx.status} ✓</Text>
                    </View>
                  </View>
                )))}
              </GlassCard>
            </View>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <View style={styles.tabSection}>
              {/* Profile Card */}
              <GlassCard style={styles.profileCard} variant="strong">
                <View style={[styles.avatar, { borderColor: theme.accentPrimary }]}>
                  <Text style={styles.avatarEmoji}>👷</Text>
                </View>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{partner?.name || 'Partner'}</Text>
                <Text style={[styles.trade, { color: theme.accentPrimary }]}>{partner?.tradeName || 'Mason / Civil Work'}</Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22C55E' }]}>
                    <Text style={{ color: '#22C55E', fontWeight: '700', fontSize: 12 }}>Aadhaar Verified ✓</Text>
                  </View>
                  <View style={[styles.starBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
                    <Text style={{ color: '#F59E0B', fontWeight: '700', fontSize: 12 }}>★ 4.9 (142 Reviews)</Text>
                  </View>
                </View>
              </GlassCard>

              {/* Appearance & 2-Color Theme Selector Section */}
              <GlassCard style={styles.themeSectionCard} variant="strong">
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      Appearance & 2-Color Theme
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                      High-visibility outdoor themes for partner
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowThemeModal(true)}
                    style={[styles.quickChangeBtn, { backgroundColor: theme.primaryLight || 'rgba(255,107,0,0.15)' }]}
                  >
                    <Text style={[styles.quickChangeText, { color: theme.accentPrimary }]}>
                      All Themes
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.themeOptionsGrid}>
                  {themesSummary.map((tItem) => {
                    const isActive = themeId === tItem.id;
                    return (
                      <TouchableOpacity
                        key={tItem.id}
                        style={[
                          styles.themePillCard,
                          {
                            backgroundColor: isActive ? (theme.primaryLight || 'rgba(255,107,0,0.15)') : 'rgba(255,255,255,0.06)',
                            borderColor: isActive ? theme.accentPrimary : theme.border
                          }
                        ]}
                        onPress={() => switchTheme(tItem.id)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.themeSwatch, { backgroundColor: tItem.bg, borderColor: tItem.primary }]}>
                          <View style={[styles.themeSwatchDot, { backgroundColor: tItem.primary }]} />
                        </View>
                        <View style={styles.themeInfoCol}>
                          <Text style={[styles.themeTitleText, { color: theme.textPrimary, fontWeight: isActive ? '900' : '700' }]}>
                            {tItem.name}
                          </Text>
                          <Text style={[styles.themeSubText, { color: theme.textSecondary }]}>
                            {tItem.subtitle}
                          </Text>
                        </View>
                        {isActive && (
                          <View style={[styles.activeCheckPill, { backgroundColor: theme.accentPrimary }]}>
                            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '900' }}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </GlassCard>

              {/* Work & Rate Information */}
              <GlassCard style={styles.infoCard} variant="default">
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Service & Base Wage</Text>

                <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Daily Base Wage</Text>
                  <Text style={[styles.infoVal, { color: theme.textPrimary }]}>₹{partner?.dailyRate || 950} / day</Text>
                </View>

                <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Operating City</Text>
                  <Text style={[styles.infoVal, { color: theme.textPrimary }]}>{partner?.city || 'Sangareddy, Telangana'}</Text>
                </View>

                <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Trade Experience</Text>
                  <Text style={[styles.infoVal, { color: theme.textPrimary }]}>{partner?.experienceYears || 8} Years</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>e-Shram Status</Text>
                  <Text style={{ color: '#22C55E', fontSize: 13, fontWeight: '700' }}>Registered (UAN Verified)</Text>
                </View>
              </GlassCard>

              {/* Logout Button */}
              <GlassButton
                title="Log Out of Partner Account"
                onPress={onLogout}
                variant="secondary"
                size="large"
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  borderColor: theme.danger || '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)'
                }}
                textStyle={{ color: theme.danger || '#EF4444' }}
              />
            </View>
          )}

          {/* Bottom spacing so content never gets hidden behind floating capsule nav */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Floating Capsule Bottom Navigation Bar with On Duty / Off Duty Center Switch */}
        <GlassFloatingBottomNav
          activeId={activeTab}
          onSelect={handleNavSelect}
          items={[
            { id: 'home', label: 'Home' },
            { id: 'jobs', label: 'Jobs' },
            { id: 'wallet', label: 'Wallet' },
            { id: 'profile', label: 'Profile' }
          ]}
          centerType="duty"
          isOnline={isOnline}
          onToggleDuty={handleToggleDuty}
        />

        {/* Modals */}
        <JobRequestModal
          visible={showJobModal}
          job={incomingJobRequest}
          onAccept={() => handleAcceptJobRequest(incomingJobRequest)}
          onDecline={handleDeclineJobRequest}
        />

        <PayoutModal
          visible={showPayoutModal}
          balance={walletBalance}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={(amt) => {
            setWalletBalance(prev => Math.max(0, prev - amt));
          }}
        />

        <NotificationsModal
          visible={showNotifications}
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={markAllAsRead}
          onMarkRead={markAsRead}
        />

        <ChatModal
          visible={showChat}
          partnerName="Customer"
          onClose={() => setShowChat(false)}
        />

<ThemeSwitcherModal
          visible={showThemeModal}
          onClose={() => setShowThemeModal(false)}
        />
        {/* 24/7 Safety SOS Modal */}
        <SosModal
          visible={showSosModal}
          onClose={() => setShowSosModal(false)}
          userRole="worker"
        />
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },
  metricsWrapper: {
    paddingHorizontal: 16,
    marginVertical: 6
  },
  metricsCard: {
    borderRadius: 22,
    borderWidth: 1.2,
    paddingVertical: 18,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 0
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricIconBox: {
    marginBottom: 4
  },
  metricIcon: {
    fontSize: 16
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center'
  },
  metricVal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2
  },
  reviewSub: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1
  },
  verticalDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.10)'
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingTop: 10
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '800'
  },
  jobItemCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12
  },
  jobItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  jobTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  jobToolEmoji: {
    fontSize: 22,
    marginRight: 10
  },
  jobItemTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  jobItemLoc: {
    fontSize: 12,
    marginTop: 2
  },
  rateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  rateText: {
    fontSize: 12,
    fontWeight: '800'
  },
  jobItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  jobMetaText: {
    fontSize: 12,
    fontWeight: '600'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  acceptBtnSmall: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10
  },
  acceptBtnSmallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  balanceCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 12
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
    letterSpacing: -0.5
  },
  balanceSub: {
    fontSize: 11
  },
  summaryCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sumItem: {
    flex: 1,
    alignItems: 'center'
  },
  sumVal: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  sumLbl: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600'
  },
  divider: {
    width: 1,
    height: 24
  },
  ledgerSection: {
    borderRadius: 20,
    padding: 16
  },
  ledgerHeading: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  txIconText: {
    fontSize: 18,
    fontWeight: '800'
  },
  txInfo: {
    flex: 1
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  txDate: {
    fontSize: 11,
    marginTop: 2
  },
  txRight: {
    alignItems: 'flex-end'
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '900'
  },
  txStatus: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontSize: 22, fontWeight: '800' },
  trade: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  starBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  themeSectionCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  quickChangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  quickChangeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  themeOptionsGrid: {
    gap: 8
  },
  themePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.2
  },
  themeSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  themeSwatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7
  },
  themeInfoCol: {
    flex: 1
  },
  themeTitleText: {
    fontSize: 13,
    letterSpacing: -0.2
  },
  themeSubText: {
    fontSize: 10,
    marginTop: 1
  },
  activeCheckPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  infoCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  infoLabel: { fontSize: 13, fontWeight: '600' },
  infoVal: { fontSize: 13, fontWeight: '700' }
});
