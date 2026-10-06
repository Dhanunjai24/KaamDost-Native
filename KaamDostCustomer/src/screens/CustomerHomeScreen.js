import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ServiceGrid from '../components/ServiceGrid';
import ActiveBookingCard from '../components/ActiveBookingCard';
import BookingModal from '../components/BookingModal';
import LanguageSelectModal from '../components/LanguageSelectModal';
import NotificationsModal from '../components/NotificationsModal';
import HelpModal from '../components/HelpModal';
import LegalPolicyModal from '../components/LegalPolicyModal';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';
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
  const { theme, shadows } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Top Header with Theme Switcher, Language & Profile */}
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
            onPressBookNow={() => {
              setSelectedTrade({ id: 'masonry', name: 'Mason', dailyRate: 950 });
              setShowBookingModal(true);
            }}
            onPressVoiceSearch={onOpenFindWorkers}
          />

          {/* Active Booking Glass Card */}
          <ActiveBookingCard
            booking={activeBooking}
            onTrackBooking={onOpenTracking}
            onNewBooking={() => {
              setSelectedTrade({ id: 'masonry', name: 'Mason', dailyRate: 950 });
              setShowBookingModal(true);
            }}
          />

          {/* 13 Telangana Service Categories in Light Glass Design */}
          <ServiceGrid onSelectTrade={handleSelectTrade} />

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

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Floating Capsule Bottom Navigation Bar Matching Screenshot */}
        <GlassFloatingBottomNav
          activeId="home"
          onSelect={(id) => {
            if (id === 'jobs' || id === 'workers') onOpenFindWorkers();
            else if (id === 'wallet') onOpenTracking();
            else if (id === 'profile') onOpenDashboard();
          }}
        />

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
