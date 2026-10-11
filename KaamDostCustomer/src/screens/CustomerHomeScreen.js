import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ServiceGrid from '../components/ServiceGrid';
import GlassBookingCard from '../../../shared/components/glass/GlassBookingCard';
import BookingModal from '../components/BookingModal';
import LanguageSelectModal from '../components/LanguageSelectModal';
import NotificationsModal from '../components/NotificationsModal';
import { useNotifications } from '../../../shared/services/notificationService';
import HelpModal from '../components/HelpModal';
import LegalPolicyModal from '../components/LegalPolicyModal';
import VoiceSearchModal from '../components/VoiceSearchModal';
import WalletModal from '../components/WalletModal';
import SelectTradeModal from '../components/SelectTradeModal';
import EditAddressModal from '../components/EditAddressModal';
import SosModal from '../../../shared/components/sos/SosModal';
import AdminOpsModal from '../../../shared/components/admin/AdminOpsModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { useResponsive } from '../utils/responsive';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';
import { t } from '../../../shared/i18n';

export default function CustomerHomeScreen({
  customer,
  activeBooking,
  onOpenFindWorkers,
  onOpenBookings,
  onOpenTracking,
  onOpenDashboard,
  onOpenSupport,
  onBookingCreated,
  onUpdateCustomer
}) {
  const { theme, shadows } = useTheme();
  const { insets, isSmallScreen } = useResponsive();
  const [city, setCity] = useState(customer?.address?.city || 'Telangana');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSelectTradeModal, setShowSelectTradeModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const customerId = customer?.id || customer?.customerId || 'cust_demo';
  const {
    notifications,
    unreadCount,
    refresh: refreshNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications({ userId: customerId, role: 'customer' });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [, setLangTicker] = useState(0);

  const handleSelectTrade = (trade) => {
    setSelectedTrade(trade);
    setShowBookingModal(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Top Header with Address Pill & Wallet Button */}
        <Header
          customer={customer}
          city={city}
          walletBalance={customer?.walletBalance || 0}
          onSelectCity={() => setShowEditAddressModal(true)}
          onEditAddress={() => setShowEditAddressModal(true)}
          onOpenWallet={() => setShowWalletModal(true)}
          onOpenLanguage={() => setShowLanguageModal(true)}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenProfile={onOpenDashboard}
onOpenSos={() => setShowSosModal(true)}
            onOpenAdmin={() => setShowAdminModal(true)}
            unreadCount={unreadCount}
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
          {/* Light Glassmorphic Hero Banner with Search */}
          <HeroBanner
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            onPressBookNow={() => setShowSelectTradeModal(true)}
            onPressVoiceSearch={() => setShowVoiceModal(true)}
          />

          {/* Active Booking Glass Card */}
          <GlassBookingCard
            booking={activeBooking}
            onTrackBooking={onOpenTracking}
            onNewBooking={() => setShowSelectTradeModal(true)}
          />

          {/* Telangana Service Categories in Light Glass Design */}
          <ServiceGrid
            onSelectTrade={handleSelectTrade}
            onViewAllTrades={() => onOpenFindWorkers && onOpenFindWorkers('all')}
          />

          {/* Banner: Telangana Labour Welfare Guarantee */}
          <View style={styles.bannerContainer}>
            <GlassCard
              style={[
                styles.govBanner,
                {
                  backgroundColor: theme.glassSurfaceStrong,
                  borderColor: theme.border
                }
              ]}
              variant="default"
            >
              <View style={[styles.govIcon, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.govEmoji}>🏛️</Text>
              </View>
              <View style={styles.govInfo}>
                <Text style={[styles.govTitle, { color: theme.textPrimary }]}>
                  Telangana Labour Welfare Guarantee
                </Text>
                <Text style={[styles.govSub, { color: theme.textSecondary }]}>
                  100% fair daily wages, zero commission deduction from workers, standard government safety norms.
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Quick Utility Links (Help, Legal, Support) */}
          <View style={styles.utilityLinksRow}>
            <TouchableOpacity
              style={[
                styles.utilBtn,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border
                },
                shadows.small
              ]}
              onPress={() => setShowHelpModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.utilIcon}>❓</Text>
              <Text style={[styles.utilText, { color: theme.textPrimary }]}>
                FAQs & Helpline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.utilBtn,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border
                },
                shadows.small
              ]}
              onPress={onOpenSupport}
              activeOpacity={0.7}
            >
              <Text style={styles.utilIcon}>🤖</Text>
              <Text style={[styles.utilText, { color: theme.textPrimary }]}>
                AI Support Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.utilBtn,
                {
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border
                },
                shadows.small
              ]}
              onPress={() => setShowLegalModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.utilIcon}>📜</Text>
              <Text style={[styles.utilText, { color: theme.textPrimary }]}>
                Legal & Terms
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 84 + (insets.bottom || 16) }} />
        </ScrollView>

        {/* Floating Capsule Bottom Navigation Bar with Glowing Flash Book Button */}
        <GlassFloatingBottomNav
          activeId="home"
          onSelect={(id) => {
            if (id === 'book') {
              setShowSelectTradeModal(true);
            } else if (id === 'jobs' || id === 'workers' || id === 'works' || id === 'trades') {
              onOpenFindWorkers && onOpenFindWorkers('all');
            } else if (id === 'bookings' || id === 'orders' || id === 'history') {
              onOpenBookings ? onOpenBookings() : onOpenTracking();
            } else if (id === 'wallet') {
              setShowWalletModal(true);
            } else if (id === 'profile') {
              onOpenDashboard();
            }
          }}
        />

        {/* Modals */}
        <SelectTradeModal
          visible={showSelectTradeModal}
          onClose={() => setShowSelectTradeModal(false)}
          onSelectTrade={(trade) => {
            setSelectedTrade(trade);
            setShowBookingModal(true);
          }}
        />

        <WalletModal
          visible={showWalletModal}
          customer={customer}
          onClose={() => setShowWalletModal(false)}
          onUpdateCustomer={onUpdateCustomer}
          onOpenDashboard={onOpenDashboard}
        />

        <BookingModal
          visible={showBookingModal}
          trade={selectedTrade}
          customer={customer}
          onChangeTrade={() => {
            setShowBookingModal(false);
            setShowSelectTradeModal(true);
          }}
          onClose={() => setShowBookingModal(false)}
          onConfirmBooking={(booking) => {
            if (onBookingCreated) onBookingCreated(booking);
          }}
        />

        <LanguageSelectModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          onSelect={() => setLangTicker(t => t + 1)}
        />

        <NotificationsModal
          visible={showNotificationsModal}
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllRead={markAllAsRead}
          onMarkRead={markAsRead}
        />

        <HelpModal
          visible={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />

        <LegalPolicyModal
          visible={showLegalModal}
          onClose={() => setShowLegalModal(false)}
        />

<VoiceSearchModal
            visible={showVoiceModal}
            onClose={() => setShowVoiceModal(false)}
            onSelectTrade={(trade) => {
              setShowVoiceModal(false);
              setSelectedTrade(trade);
              setShowTradeModal(true);
            }}
          />
          <SosModal
            visible={showSosModal}
            onClose={() => setShowSosModal(false)}
            userRole="customer"
          />
          <AdminOpsModal
            visible={showAdminModal}
            onClose={() => setShowAdminModal(false)}
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
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 10
  },
  govBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  govIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  govEmoji: {
    fontSize: 20
  },
  govInfo: {
    flex: 1
  },
  govTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  govSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16
  },
  utilityLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8
  },
  utilBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5
  },
  utilIcon: {
    fontSize: 14
  },
  utilText: {
    fontSize: 11,
    fontWeight: '700'
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
    width: 52
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
    fontWeight: '600',
    letterSpacing: -0.2
  },
  fabBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    top: -16
  },
  fabIcon: {
    fontSize: 18,
    color: '#FFFFFF'
  },
  fabText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: -2
  }
});
