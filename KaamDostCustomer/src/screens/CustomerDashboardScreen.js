import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import GlassProfileCard from '../../../shared/components/glass/GlassProfileCard';
import GlassPaymentCard from '../../../shared/components/glass/GlassPaymentCard';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';
import { t } from '../../../shared/i18n';

export default function CustomerDashboardScreen({ customer, onBack, onLogout, onSelectPastBooking }) {
  const { theme, themeId, switchTheme, shadows } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const pastBookings = [
    { id: 'BK-1001', trade: 'plumbing', tradeName: 'Plumber', worker: 'Venkat Rao', date: 'Yesterday', amount: 849, status: 'COMPLETED' },
    { id: 'BK-1002', trade: 'electrical', tradeName: 'Electrician', worker: 'K. Shiva Kumar', date: '22 Sep 2026', amount: 899, status: 'COMPLETED' },
    { id: 'BK-1003', trade: 'masonry', tradeName: 'Mason', worker: 'Ramesh Reddy', date: '15 Sep 2026', amount: 1045, status: 'COMPLETED' }
  ];

  const themesSummary = [
    { id: 'light_navy', name: 'Light + Navy Blue', subtitle: 'Default • Cool white & Royal navy', bg: '#F4F8FC', primary: '#0B2341' },
    { id: 'white_teal', name: 'White + Deep Teal', subtitle: 'Fresh mint & Authoritative teal', bg: '#F6FBFA', primary: '#073B3A' },
    { id: 'ivory_indigo', name: 'Soft Ivory + Deep Indigo', subtitle: 'Warm ivory & Aristocratic indigo', bg: '#FAF9F6', primary: '#25234A' }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Header */}
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
            My Account & Settings
          </Text>
          <TouchableOpacity
            onPress={() => setShowThemeModal(true)}
            style={[styles.paletteBtn, { backgroundColor: theme.primaryLight }]}
            activeOpacity={0.7}
          >
            <Text style={styles.paletteIcon}>🎨</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header Glass Card */}
          <GlassProfileCard
            name={customer?.name || 'Ravi Kumar'}
            phone={customer?.phone || '9876543210'}
            city={customer?.address?.city || 'Sangareddy'}
            isVerified={true}
          />

          {/* Wallet Balance Glass Card */}
          <GlassPaymentCard
            balance={100}
            bonusAmount={100}
            onAddMoney={() => Alert.alert('Add Funds', 'Instant UPI top-up enabled via secure gateway.')}
          />

          {/* Theme Selector Section */}
          <GlassCard style={styles.themeSectionCard} variant="strong">
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Appearance & 2-Color Theme
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Select your preferred glassmorphic visual system
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowThemeModal(true)}
                style={[styles.quickChangeBtn, { backgroundColor: theme.primaryLight }]}
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
                        backgroundColor: isActive ? theme.primaryLight : theme.glassSurface,
                        borderColor: isActive ? theme.accentPrimary : theme.border
                      }
                    ]}
                    onPress={() => switchTheme(tItem.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.themeSwatch,
                        { backgroundColor: tItem.bg, borderColor: tItem.primary }
                      ]}
                    >
                      <View
                        style={[styles.themeSwatchDot, { backgroundColor: tItem.primary }]}
                      />
                    </View>
                    <View style={styles.themeInfoCol}>
                      <Text
                        style={[
                          styles.themeTitleText,
                          {
                            color: theme.textPrimary,
                            fontWeight: isActive ? '900' : '700'
                          }
                        ]}
                      >
                        {tItem.name}
                      </Text>
                      <Text style={[styles.themeSubText, { color: theme.textSecondary }]}>
                        {tItem.subtitle}
                      </Text>
                    </View>
                    {isActive ? (
                      <View
                        style={[
                          styles.activeCheckPill,
                          { backgroundColor: theme.accentPrimary }
                        ]}
                      >
                        <Text style={styles.checkIcon}>✓</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Saved Address Section */}
          <GlassCard style={styles.sectionCard} variant="default">
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Default Service Address
            </Text>
            <View style={styles.addressBox}>
              <View
                style={[
                  styles.addressIconBox,
                  { backgroundColor: theme.primaryLight, borderColor: theme.border, borderWidth: 1 }
                ]}
              >
                <Text style={styles.addressIcon}>📍</Text>
              </View>
              <View style={styles.addressInfo}>
                <Text style={[styles.addressType, { color: theme.textPrimary }]}>
                  Home (Default Delivery Point)
                </Text>
                <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                  Plot 42, Near Old Bus Stand Road, Sangareddy, Telangana - 502001
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Past Bookings History */}
          <GlassCard style={styles.sectionCard} variant="default">
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Past Bookings History
            </Text>
            {pastBookings.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.bookingItem, { borderBottomColor: theme.borderLight }]}
                onPress={() => onSelectPastBooking && onSelectPastBooking(b)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.bookingIcon,
                    { backgroundColor: theme.primaryLight, borderColor: theme.border, borderWidth: 1 }
                  ]}
                >
                  <Text style={styles.bIconEmoji}>🛠️</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={[styles.bookingTrade, { color: theme.textPrimary }]}>
                    {b.tradeName} • {b.worker}
                  </Text>
                  <Text style={[styles.bookingDate, { color: theme.textSecondary }]}>
                    {b.date} • {b.id}
                  </Text>
                </View>
                <View style={styles.bookingRight}>
                  <Text style={[styles.bookingAmount, { color: theme.textPrimary }]}>
                    ₹{b.amount}
                  </Text>
                  <View style={[styles.statusTag, { backgroundColor: theme.successLight }]}>
                    <Text style={[styles.statusText, { color: theme.success }]}>
                      Completed ✓
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </GlassCard>

          {/* Logout Button */}
          <GlassButton
            title="Log Out of KaamDost"
            onPress={onLogout}
            variant="secondary"
            size="md"
            style={{
              marginTop: 10,
              marginBottom: 34,
              borderColor: theme.danger,
              backgroundColor: theme.dangerLight
            }}
            textStyle={{ color: theme.danger }}
          />
        </ScrollView>

        <ThemeSwitcherModal
          visible={showThemeModal}
          onClose={() => setShowThemeModal(false)}
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
    paddingRight: 8,
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
  paletteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  paletteIcon: {
    fontSize: 16
  },
  content: {
    padding: 16
  },
  themeSectionCard: {
    marginVertical: 6,
    borderRadius: 20
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  quickChangeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  quickChangeText: {
    fontSize: 11,
    fontWeight: '700'
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
    borderWidth: 1.5,
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
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  sectionCard: {
    marginVertical: 6,
    borderRadius: 20
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10
  },
  addressIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  addressIcon: {
    fontSize: 18
  },
  addressInfo: {
    flex: 1
  },
  addressType: {
    fontSize: 13,
    fontWeight: '800'
  },
  addressText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  bIconEmoji: {
    fontSize: 18
  },
  bookingInfo: {
    flex: 1
  },
  bookingTrade: {
    fontSize: 13,
    fontWeight: '800'
  },
  bookingDate: {
    fontSize: 11,
    marginTop: 2
  },
  bookingRight: {
    alignItems: 'flex-end'
  },
  bookingAmount: {
    fontSize: 15,
    fontWeight: '900'
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800'
  }
});
