import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PartnerHeader from '../components/PartnerHeader';
import EarningsCard from '../components/EarningsCard';
import ActiveJobCard from '../components/ActiveJobCard';
import JobRequestModal from '../components/JobRequestModal';
import PayoutModal from '../components/PayoutModal';
import ChatModal from '../components/ChatModal';
import NotificationsModal from '../components/NotificationsModal';
import SosModal from '../../../shared/components/sos/SosModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';

export default function PartnerDashboardScreen({
  partner,
  onOpenEarnings,
  onOpenProfile,
  onOpenSupport,
  onLogout
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(1850);
  const [completedJobsCount, setCompletedJobsCount] = useState(18);
  const [hoursWorked, setHoursWorked] = useState(9.5);
  const [rating, setRating] = useState('4.9');
  const [reviewsCount, setReviewsCount] = useState(31);
  const [walletBalance, setWalletBalance] = useState(3850);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [pendingJobRequest, setPendingJobRequest] = useState(null);

  const [activeJob, setActiveJob] = useState({
    id: 'lead_901',
    tradeName: 'New Masonry Task',
    location: 'Sangareddy',
    distance: '2.4 km away',
    dailyRate: 950,
    status: 'INCOMING',
    customerName: 'Anil Varma',
    customerPhone: '9848011223',
    address: 'Near Old Bus Stand, Sangareddy'
  });

  const handleRefresh = () => {
    setRefreshing(true);
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

  const handleJobStatusChange = (newStatus) => {
    if (newStatus === 'COMPLETED') {
      setActiveJob(null);
      setTodayEarnings(prev => prev + 950);
      setCompletedJobsCount(prev => prev + 1);
      Alert.alert('Payment Received!', '₹950 credited to your earnings.');
    } else {
      setActiveJob(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleNavSelect = (id) => {
    setActiveTab(id);
    if (id === 'wallet') {
      if (onOpenEarnings) onOpenEarnings();
    } else if (id === 'profile') {
      if (onOpenProfile) onOpenProfile();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Top Header Matching Screenshot 2 */}
        <PartnerHeader
          partnerName={partner?.name || 'RAJU KUMAR'}
          rating={rating}
          isOnline={isOnline}
          onToggleDuty={handleToggleDuty}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenEarnings={onOpenEarnings}
          onOpenSos={() => setShowSosModal(true)}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FF6B00"
              colors={['#FF6B00']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Earnings Card Matching Screenshot 2 */}
          <EarningsCard
            todayEarnings={todayEarnings}
            onRequestPayout={() => setShowPayoutModal(true)}
          />

          {/* New Masonry Task Alert Card Matching Screenshot 2 */}
          <ActiveJobCard
            job={activeJob}
            onStatusChange={handleJobStatusChange}
            onOpenChat={() => setShowChat(true)}
          />

          {/* 3-Column Metrics / Stats Card Matching Screenshot 2 */}
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
              {/* Column 1: Completed Jobs */}
              <View style={styles.metricCol}>
                <View style={styles.metricIconBox}>
                  <Text style={styles.metricIcon}>☑️</Text>
                </View>
                <Text style={styles.metricLabel}>Completed Jobs</Text>
                <Text style={styles.metricVal}>({completedJobsCount})</Text>
              </View>

              {/* Divider */}
              <View style={styles.verticalDivider} />

              {/* Column 2: Hours Worked */}
              <View style={styles.metricCol}>
                <View style={styles.metricIconBox}>
                  <Text style={styles.metricIcon}>🕒</Text>
                </View>
                <Text style={styles.metricLabel}>Hours Worked</Text>
                <Text style={styles.metricVal}>({hoursWorked}h)</Text>
              </View>

              {/* Divider */}
              <View style={styles.verticalDivider} />

              {/* Column 3: Rating */}
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

          {/* Bottom spacing so content never gets hidden behind floating nav */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Capsule Bottom Navigation Bar Matching Screenshot 1 */}
        <GlassFloatingBottomNav
          activeId={activeTab}
          onSelect={handleNavSelect}
        />

        {/* Modals */}
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
          onClose={() => setShowNotifications(false)}
        />

        <ChatModal
          visible={showChat}
          partnerName="Anil Varma (Customer)"
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
  }
});
