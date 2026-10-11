import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';

export default function CustomerBookingsScreen({
  customer,
  activeBooking,
  onBack,
  onOpenHome,
  onOpenFindWorkers,
  onOpenTracking,
  onOpenDashboard,
  onBookingCreated
}) {
  const { theme, shadows } = useTheme();
  const [activeTab, setActiveTab] = useState(activeBooking ? 'active' : 'history');
  const [historyList, setHistoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('@kaamdost_booking_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleanList = parsed.filter(b => b.id !== 'BK-7821' && b.id !== 'BK-5409');
          setHistoryList(cleanList);
          if (cleanList.length !== parsed.length) {
            await AsyncStorage.setItem('@kaamdost_booking_history', JSON.stringify(cleanList)).catch(() => {});
          }
          return;
        }
      }
      setHistoryList([]);
    } catch (e) {
      setHistoryList([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeBooking]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Top Header */}
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
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Bookings & History
          </Text>
          <TouchableOpacity
            style={[styles.profilePill, { backgroundColor: theme.primaryLight }]}
            onPress={onOpenDashboard}
            activeOpacity={0.7}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Segmented Control: Active vs Past */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'active' && [
                styles.segmentBtnActive,
                { backgroundColor: theme.accentPrimary }
              ]
            ]}
            onPress={() => setActiveTab('active')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'active' ? '#FFFFFF' : theme.textSecondary }
              ]}
            >
              Active Order {activeBooking ? '●' : '(0)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'history' && [
                styles.segmentBtnActive,
                { backgroundColor: theme.accentPrimary }
              ]
            ]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'history' ? '#FFFFFF' : theme.textSecondary }
              ]}
            >
              Past History ({historyList.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
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
          {/* TAB 1: ACTIVE BOOKINGS */}
          {activeTab === 'active' && (
            <View>
              {activeBooking ? (
                <GlassCard style={styles.activeCard} variant="strong">
                  <View style={styles.cardHeaderRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: theme.primaryLight, borderColor: theme.accentPrimary }
                      ]}
                    >
                      <Text style={[styles.statusText, { color: theme.accentPrimary }]}>
                        ● {activeBooking.status || 'En Route'}
                      </Text>
                    </View>
                    <Text style={[styles.bookingIdText, { color: theme.textSecondary }]}>
                      {activeBooking.id || 'BK-ACTIVE'}
                    </Text>
                  </View>

                  <View style={styles.workerRow}>
                    <View style={[styles.workerAvatar, { backgroundColor: theme.primaryLight }]}>
                      <Text style={styles.workerEmoji}>👷</Text>
                    </View>
                    <View style={styles.workerInfo}>
                      <Text style={[styles.workerName, { color: theme.textPrimary }]}>
                        {activeBooking.workerName || 'Assigned Dost'}
                      </Text>
                      <Text style={[styles.tradeTitle, { color: theme.textSecondary }]}>
                        {activeBooking.tradeName || 'Specialist'}
                      </Text>
                      <Text style={[styles.workerRating, { color: theme.accentPrimary }]}>
                        ⭐ {activeBooking.workerRating || 4.9} Verified Partner
                      </Text>
                    </View>
                  </View>

                  {/* Start OTP */}
                  <View
                    style={[
                      styles.otpContainer,
                      {
                        backgroundColor: theme.glassSurface,
                        borderColor: theme.border
                      }
                    ]}
                  >
                    <View>
                      <Text style={[styles.otpLabel, { color: theme.textSecondary }]}>
                        Job Start OTP Code
                      </Text>
                      <Text style={[styles.otpSub, { color: theme.textMuted }]}>
                        Share with partner at arrival
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.otpBadge,
                        { backgroundColor: theme.accentPrimary }
                      ]}
                    >
                      <Text style={styles.otpValue}>
                        {activeBooking.startOtp || '4829'}
                      </Text>
                    </View>
                  </View>

                  {/* Address & Fee */}
                  <View style={styles.detailsRow}>
                    <Text style={[styles.detailKey, { color: theme.textSecondary }]}>Location:</Text>
                    <Text
                      style={[styles.detailVal, { color: theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {activeBooking.address || 'Service Location'}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={[styles.detailKey, { color: theme.textSecondary }]}>Payable:</Text>
                    <Text style={[styles.detailVal, { color: theme.textPrimary, fontWeight: '800' }]}>
                      ₹{activeBooking.totalAmount || activeBooking.dailyRate || 950}
                    </Text>
                  </View>

                  <GlassButton
                    title="Track Live Partner & ETA ➔"
                    onPress={onOpenTracking}
                    variant="primary"
                    size="md"
                    style={{ marginTop: 14 }}
                  />
                </GlassCard>
              ) : (
                <GlassCard style={styles.emptyCard} variant="default">
                  <Text style={styles.emptyEmoji}>📋</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                    No Active Bookings Right Now
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                    Looking for reliable, verified daily-wage specialists with standard Telangana labour rates?
                  </Text>
                  <GlassButton
                    title="Book a Verified Dost Now"
                    onPress={() => (onOpenFindWorkers ? onOpenFindWorkers('all') : onOpenHome())}
                    variant="primary"
                    size="md"
                    style={{ marginTop: 16 }}
                  />
                </GlassCard>
              )}
            </View>
          )}

          {/* TAB 2: PAST BOOKING HISTORY */}
          {activeTab === 'history' && (
            <View>
              {historyList.length === 0 ? (
                <GlassCard style={styles.emptyCard} variant="default">
                  <Text style={styles.emptyEmoji}>📜</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                    No Past Bookings Found
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                    Completed and closed services will be preserved here for easy re-booking and invoices.
                  </Text>
                </GlassCard>
              ) : (
                historyList.map((item) => (
                  <GlassCard key={item.id} style={styles.historyCard} variant="default">
                    <View style={styles.historyHeader}>
                      <View style={styles.historyLeftCol}>
                        <Text style={[styles.historyTrade, { color: theme.textPrimary }]}>
                          {item.tradeName}
                        </Text>
                        <Text style={[styles.historyWorker, { color: theme.textSecondary }]}>
                          {item.worker}
                        </Text>
                      </View>
                      <View style={styles.historyRightCol}>
                        <Text style={[styles.historyAmount, { color: theme.textPrimary }]}>
                          ₹{item.amount}
                        </Text>
                        <View style={[styles.completedPill, { backgroundColor: theme.successLight }]}>
                          <Text style={[styles.completedText, { color: theme.success }]}>
                            Completed ✓
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

                    <View style={styles.historyFooter}>
                      <Text style={[styles.historyDate, { color: theme.textMuted }]}>
                        {item.date} • {item.id}
                      </Text>
                      <TouchableOpacity
                        style={[styles.rebookBtn, { backgroundColor: theme.primaryLight }]}
                        onPress={() => {
                          if (onOpenFindWorkers) onOpenFindWorkers(item.tradeId || 'all');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.rebookText, { color: theme.accentPrimary }]}>
                          Re-Book Trade ↺
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Floating Capsule Bottom Navigation Bar */}
        <GlassFloatingBottomNav
          activeId="bookings"
          onSelect={(id) => {
            if (id === 'book') onOpenFindWorkers();
            else if (id === 'home') onOpenHome();
            else if (id === 'jobs' || id === 'trades' || id === 'works' || id === 'workers') onOpenFindWorkers();
            else if (id === 'bookings') setActiveTab('active');
            else if (id === 'profile') onOpenDashboard();
          }}
        />
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
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '800'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  profilePill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileIcon: {
    fontSize: 16
  },
  segmentedContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  segmentBtnActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '800'
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  activeCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 16
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800'
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: '700'
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  workerEmoji: {
    fontSize: 26
  },
  workerInfo: {
    flex: 1
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800'
  },
  tradeTitle: {
    fontSize: 13,
    marginTop: 2
  },
  workerRating: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14
  },
  otpLabel: {
    fontSize: 12,
    fontWeight: '800'
  },
  otpSub: {
    fontSize: 10,
    marginTop: 1
  },
  otpBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10
  },
  otpValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4
  },
  detailKey: {
    fontSize: 12
  },
  detailVal: {
    fontSize: 12,
    maxWidth: '70%'
  },
  emptyCard: {
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260
  },
  historyCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  historyLeftCol: {
    flex: 1,
    paddingRight: 8
  },
  historyTrade: {
    fontSize: 14,
    fontWeight: '800'
  },
  historyWorker: {
    fontSize: 12,
    marginTop: 3
  },
  historyRightCol: {
    alignItems: 'flex-end'
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '900'
  },
  completedPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4
  },
  completedText: {
    fontSize: 10,
    fontWeight: '800'
  },
  divider: {
    height: 1,
    marginVertical: 12
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '600'
  },
  rebookBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  rebookText: {
    fontSize: 11,
    fontWeight: '800'
  }
});
