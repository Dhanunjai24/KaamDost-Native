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
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerDashboardScreen({
  partner,
  onOpenEarnings,
  onOpenProfile,
  onOpenSupport,
  onLogout
}) {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Partner Header */}
      <PartnerHeader
        partnerName={partner?.name || 'Ramesh Reddy'}
        trade={partner?.tradeName || 'Mason'}
        isOnline={isOnline}
        onToggleDuty={handleToggleDuty}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenEarnings={onOpenEarnings}
      />

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>💡 Demo Simulator</Text>
          <TouchableOpacity style={styles.demoBtn} onPress={triggerDemoJob}>
            <Text style={styles.demoBtnText}>Simulate Incoming Customer Job Alert 🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Welfare Guarantee Card */}
        <View style={styles.welfareCard}>
          <Text style={styles.welfareIcon}>🛡️</Text>
          <View style={styles.welfareInfo}>
            <Text style={styles.welfareTitle}>Telangana Worker Protection Act</Text>
            <Text style={styles.welfareSub}>
              Accidental insurance up to ₹5,00,000 active during work hours. Emergency desk available 24/7.
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Text style={[styles.navIcon, styles.navIconActive]}>📊</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onOpenEarnings}>
          <Text style={styles.navIcon}>💰</Text>
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onOpenSupport}>
          <Text style={styles.navIcon}>🛟</Text>
          <Text style={styles.navText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onOpenProfile}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
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
        partnerName={activeJob?.customerName || 'Ravi Kumar'}
        onClose={() => setShowChat(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scroll: {
    flex: 1
  },
  demoCard: {
    backgroundColor: '#fffbeb',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fef3c7'
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 8
  },
  demoBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  demoBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  welfareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0'
  },
  welfareIcon: {
    fontSize: 24,
    marginRight: 10
  },
  welfareInfo: {
    flex: 1
  },
  welfareTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065f46'
  },
  welfareSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    ...SHADOWS.medium
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  navIcon: {
    fontSize: 18,
    color: COLORS.textMuted
  },
  navIconActive: {
    color: COLORS.primary
  },
  navText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: '800'
  }
});
