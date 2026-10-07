import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, RefreshControl, Alert } from 'react-native';
import PartnerHeader from '../components/PartnerHeader';
import DutyToggle from '../components/DutyToggle';
import EarningsCard from '../components/EarningsCard';
import ActiveJobCard from '../components/ActiveJobCard';
import JobRequestModal from '../components/JobRequestModal';
import PayoutModal from '../components/PayoutModal';
import ChatModal from '../../KaamDostCustomer/src/components/ChatModal';
import NotificationsModal from '../../KaamDostCustomer/src/components/NotificationsModal';
import SosModal from '../../../shared/components/sos/SosModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';

export default function PartnerDashboardScreen({
  partner,
  onOpenEarnings,
  onOpenProfile,
  onOpenSupport,
  onLogout
}) {
  const { theme, shadows } = useTheme();
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState({
    id: 'JOB-902',
    tradeName: partner?.tradeName || 'Mason / Civil Work',
    status: 'ARRIVING',
    customerName: 'Ravi Kumar',
    customerPhone: '9876543210',
    address: 'Balaji Nagar, Sangareddy (1.4 km)',
    dailyRate: partner?.dailyRate || 950,
    startOtp: '4829',
    workNotes: 'Wall plastering & floor tile repair'
  });

  const [pendingJobRequest, setPendingJobRequest] = useState(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [todayEarnings, setTodayEarnings] = useState(1900);
  const [completedJobsCount, setCompletedJobsCount] = useState(2);
  const [walletBalance, setWalletBalance] = useState(3850);

  const handleToggleDuty = () => {
    setIsOnline(!isOnline);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Simulate an incoming job alert for demo
  const triggerDemoJob = () => {
    setPendingJobRequest({
      id: 'JOB-' + Math.floor(Math.random() * 8999 + 1000),
      tradeName: partner?.tradeName || 'Mason Work',
      dailyRate: partner?.dailyRate || 950,
      address: 'Near Old Bus Stand, Sangareddy (0.8 km)',
      workNotes: 'Ceiling crack repair and emergency wall support'
    });
  };

  const handleAcceptJob = (job) => {
    setActiveJob({
      ...job,
      status: 'ARRIVING',
      customerName: 'Srinivas Goud',
      customerPhone: '9849011223',
      startOtp: '5192'
    });
    setPendingJobRequest(null);
  };

  const handleDeclineJob = () => {
    setPendingJobRequest(null);
  };

  const handleJobStatusChange = (newStatus) => {
    if (newStatus === 'COMPLETED') {
      setActiveJob(prev => ({ ...prev, status: 'COMPLETED' }));
      setTodayEarnings(prev => prev + (activeJob.dailyRate || 950));
      setCompletedJobsCount(prev => prev + 1);
      setWalletBalance(prev => prev + (activeJob.dailyRate || 950));
      setTimeout(() => {
        Alert.alert('Payment Received!', `₹${activeJob.dailyRate || 950} credited to your ledger.`);
        setActiveJob(null);
      }, 1500);
    } else {
      setActiveJob(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Partner Header */}
        <PartnerHeader
          partnerName={partner?.name || 'Ramesh Reddy'}
          trade={partner?.tradeName || 'Mason'}
          isOnline={isOnline}
          onToggleDuty={handleToggleDuty}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenEarnings={onOpenEarnings}
          onOpenSos={() => setShowSosModal(true)}
        />

        <ScrollView
          style={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.accentPrimary}
              colors={[theme.accentPrimary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Duty Status Switcher */}
          <DutyToggle isOnline={isOnline} onToggle={handleToggleDuty} />

          {/* Today's Earnings & Instant Payout Card */}
          <EarningsCard
            todayEarnings={todayEarnings}
            completedJobs={completedJobsCount}
            walletBalance={walletBalance}
            onRequestPayout={() => setShowPayoutModal(true)}
          />

          {/* Current Active Job Card */}
          <ActiveJobCard
            job={activeJob}
            onStatusChange={handleJobStatusChange}
            onOpenChat={() => setShowChat(true)}
          />

          {/* Demo Button to trigger incoming customer job popup */}
          <View style={styles.demoCardContainer}>
            <GlassCard style={styles.demoCard} variant="subtle">
              <Text style={[styles.demoTitle, { color: theme.textPrimary }]}>
                💡 Demo Simulator
              </Text>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: theme.primaryLight, borderColor: theme.border, borderWidth: 1 }]}
                onPress={triggerDemoJob}
                activeOpacity={0.8}
              >
                <Text style={[styles.demoBtnText, { color: theme.textPrimary }]}>
                  Simulate Incoming Customer Job Alert 🔔
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Welfare Guarantee Card */}
          <View style={styles.welfareContainer}>
            <GlassCard style={styles.welfareCard} variant="default">
              <Text style={styles.welfareIcon}>🛡️</Text>
              <View style={styles.welfareInfo}>
                <Text style={[styles.welfareTitle, { color: theme.textPrimary }]}>
                  Telangana Worker Protection Act
                </Text>
                <Text style={[styles.welfareSub, { color: theme.textSecondary }]}>
                  Accidental insurance up to ₹5,00,000 active during work hours. Emergency desk available 24/7.
                </Text>
              </View>
            </GlassCard>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Light Glassmorphic Bottom Navigation Bar */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderTopColor: theme.border
            },
            shadows.medium
          ]}
        >
          <TouchableOpacity style={styles.navItem} onPress={() => {}} activeOpacity={0.7}>
            <View style={[styles.navIconContainer, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.navIcon}>📊</Text>
            </View>
            <Text style={[styles.navText, { color: theme.textPrimary, fontWeight: '800' }]}>
              Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onOpenEarnings} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>💰</Text>
            </View>
            <Text style={[styles.navText, { color: theme.textSecondary }]}>
              Earnings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onOpenSupport} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>🛟</Text>
            </View>
            <Text style={[styles.navText, { color: theme.textSecondary }]}>
              Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onOpenProfile} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>👤</Text>
            </View>
            <Text style={[styles.navText, { color: theme.textSecondary }]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Incoming Job Modal */}
        <JobRequestModal
          visible={!!pendingJobRequest}
          job={pendingJobRequest}
          onAccept={handleAcceptJob}
          onDecline={handleDeclineJob}
        />

        {/* Payout Modal */}
        <PayoutModal
          visible={showPayoutModal}
          balance={walletBalance}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={(amt) => {
            setWalletBalance(prev => Math.max(0, prev - amt));
          }}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

        {/* Chat Modal */}
        <ChatModal
          visible={showChat}
          partnerName="Ravi Kumar (Customer)"
          onClose={() => setShowChat(false)}
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
  demoCardContainer: {
    paddingHorizontal: 16,
    marginVertical: 4
  },
  demoCard: {
    borderRadius: 18,
    padding: 14
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8
  },
  demoBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '800'
  },
  welfareContainer: {
    paddingHorizontal: 16,
    marginVertical: 6
  },
  welfareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14
  },
  welfareIcon: {
    fontSize: 24,
    marginRight: 12
  },
  welfareInfo: {
    flex: 1
  },
  welfareTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  welfareSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1.2,
    paddingHorizontal: 10
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2
  },
  navIcon: {
    fontSize: 16
  },
  navText: {
    fontSize: 10,
    fontWeight: '600'
  }
});
