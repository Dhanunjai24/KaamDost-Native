import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ServiceGrid from '../components/ServiceGrid';
import ActiveBookingCard from '../components/ActiveBookingCard';
import BookingModal from '../components/BookingModal';
import LanguageSelectModal from '../components/LanguageSelectModal';
import NotificationsModal from '../components/NotificationsModal';
import HelpModal from '../components/HelpModal';
import LegalPolicyModal from '../components/LegalPolicyModal';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function CustomerHomeScreen({
  customer,
  activeBooking,
  onOpenFindWorkers,
  onOpenTracking,
  onOpenDashboard,
  onOpenSupport,
  onBookingCreated
}) {
  const [city, setCity] = useState(customer?.address?.city || 'Sangareddy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSelectTrade = (trade) => {
    setSelectedTrade(trade);
    setShowBookingModal(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Top Header */}
      <Header
        city={city}
        onSelectCity={() => setShowBookingModal(true)}
        onOpenLanguage={() => setShowLanguageModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenProfile={onOpenDashboard}
        unreadCount={2}
      />

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Quick Search */}
        <HeroBanner
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          onPressBookNow={() => {
            setSelectedTrade({ id: 'masonry', name: 'Mason', dailyRate: 950 });
            setShowBookingModal(true);
          }}
          onPressVoiceSearch={onOpenFindWorkers}
        />

        {/* Active Booking Card */}
        <ActiveBookingCard
          booking={activeBooking}
          onTrackBooking={onOpenTracking}
        />

        {/* 13 Telangana Service Categories */}
        <ServiceGrid onSelectTrade={handleSelectTrade} />

        {/* Banner: Telangana Labour Welfare Guarantee */}
        <View style={styles.bannerContainer}>
          <View style={styles.govBanner}>
            <View style={styles.govIcon}>
              <Text style={styles.govEmoji}>🏛️</Text>
            </View>
            <View style={styles.govInfo}>
              <Text style={styles.govTitle}>Telangana Labour Welfare Guarantee</Text>
              <Text style={styles.govSub}>
                100% fair daily wages, zero commission deduction from workers, standard government safety norms.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Utility Links (Help, Legal, Support) */}
        <View style={styles.utilityLinksRow}>
          <TouchableOpacity style={styles.utilBtn} onPress={() => setShowHelpModal(true)}>
            <Text style={styles.utilIcon}>❓</Text>
            <Text style={styles.utilText}>FAQs & Helpline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilBtn} onPress={onOpenSupport}>
            <Text style={styles.utilIcon}>🤖</Text>
            <Text style={styles.utilText}>AI Support Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilBtn} onPress={() => setShowLegalModal(true)}>
            <Text style={styles.utilIcon}>📜</Text>
            <Text style={styles.utilText}>Legal & Terms</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Bar (Find Workers / Instant Booking) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}
        >
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={onOpenFindWorkers}
        >
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navText}>Workers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fabBtn}
          onPress={() => {
            setSelectedTrade({ id: 'masonry', name: 'Mason', dailyRate: 950 });
            setShowBookingModal(true);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>⚡</Text>
          <Text style={styles.fabText}>Book</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={onOpenTracking}
        >
          <Text style={styles.navIcon}>📍</Text>
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={onOpenDashboard}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <BookingModal
        visible={showBookingModal}
        trade={selectedTrade}
        onClose={() => setShowBookingModal(false)}
        onConfirmBooking={(booking) => {
          if (onBookingCreated) onBookingCreated(booking);
        }}
      />

      <LanguageSelectModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      <HelpModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <LegalPolicyModal
        visible={showLegalModal}
        onClose={() => setShowLegalModal(false)}
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
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 10
  },
  govBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 14
  },
  govIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
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
    fontWeight: '800',
    color: '#065f46'
  },
  govSub: {
    fontSize: 11,
    color: '#047857',
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
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4
  },
  utilIcon: {
    fontSize: 14
  },
  utilText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: 10,
    ...SHADOWS.medium
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
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
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
    ...SHADOWS.large
  },
  fabIcon: {
    fontSize: 18,
    color: COLORS.textWhite
  },
  fabText: {
    fontSize: 9,
    color: COLORS.textWhite,
    fontWeight: '800'
  }
});
