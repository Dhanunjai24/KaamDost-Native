import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerHomeScreen({
  customer,
  activeBooking,
  onOpenCategories,
  onOpenSearch,
  onSelectService,
  onOpenTracking,
  onOpenBookings,
  onOpenWallet,
  onOpenProfile,
  onOpenNotifications,
}) {
  const [activeTab, setActiveTab] = useState('Home');

  const quickCategories = [
    {
      id: 'cleaning',
      title: 'Home Cleaning',
      icon: '🧹',
      bg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      id: 'plumbing',
      title: 'Plumbing',
      icon: '🔧',
      bg: '#f0fdfa',
      iconColor: '#0d9488',
    },
    {
      id: 'electrician',
      title: 'Electrician',
      icon: '⚡',
      bg: '#fefce8',
      iconColor: '#ca8a04',
    },
    {
      id: 'beauty',
      title: 'Beauty & Wellness',
      icon: '💆‍♀️',
      bg: '#fdf2f8',
      iconColor: '#db2777',
    },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'Services' && onOpenCategories) onOpenCategories();
    if (tabId === 'Bookings' && onOpenBookings) onOpenBookings();
    if (tabId === 'Wallet' && onOpenWallet) onOpenWallet();
    if (tabId === 'Profile' && onOpenProfile) onOpenProfile();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />

      {/* Top Header Bar matching screen_09 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Good Morning, {customer?.name ? customer.name.split(' ')[0] : 'Rahul'}</Text>
            <View style={styles.locationPill}>
              <Text style={styles.locationText} numberOfLines={1}>
                📍 {customer?.address?.street || '123 Green Park, New Delhi'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bellBtn}
          onPress={onOpenNotifications}
          activeOpacity={0.75}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Frosted Pill Search Bar matching screen_09 */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onOpenSearch}
          activeOpacity={0.9}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search services....</Text>
        </TouchableOpacity>

        {/* Category Grid Card matching screen_09 */}
        <View style={styles.categoriesCard}>
          <View style={styles.categoriesGrid}>
            {quickCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => onSelectService && onSelectService(cat)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg }]}>
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Bookings Card matching screen_09 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Bookings</Text>
          {activeBooking && (
            <TouchableOpacity onPress={onOpenTracking}>
              <Text style={styles.trackLiveText}>Track Live 📍</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeBooking ? (
          <TouchableOpacity
            style={styles.activeBookingCard}
            onPress={onOpenTracking}
            activeOpacity={0.9}
          >
            <View style={styles.bookingCardLeft}>
              <View style={styles.serviceAvatar}>
                <Text style={styles.serviceAvatarEmoji}>🧹</Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingServiceName}>
                  Deep Cleaning
                </Text>
                <Text style={styles.bookingWorkerName}>
                  Door Cleaning
                </Text>
              </View>
            </View>

            <View style={styles.bookingCardRight}>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>In Progress</Text>
              </View>
              <View style={styles.timePill}>
                <Text style={styles.bookingTimeText}>
                  11:23 AM
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noBookingCard}>
            <Text style={styles.noBookingEmoji}>✨</Text>
            <Text style={styles.noBookingTitle}>No active orders right now</Text>
            <Text style={styles.noBookingSub}>Choose any service above to book verified local workers.</Text>
          </View>
        )}

        {/* 100% Fair Wage & Labour Welfare Card */}
        <View style={styles.guaranteeCard}>
          <View style={styles.shieldIconBox}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <View style={styles.guaranteeTextCol}>
            <Text style={styles.guaranteeHeading}>100% Fair Wage & Welfare Protection</Text>
            <Text style={styles.guaranteeSub}>
              Zero platform commissions deducted from workers. Direct UPI payments.
            </Text>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Dock matching screen_09 */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...SHADOWS.sm,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  locationPill: {
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#5f7da6',
    fontWeight: '600',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.sm,
  },
  bellIcon: {
    fontSize: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    position: 'absolute',
    top: 9,
    right: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 18,
    ...SHADOWS.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    opacity: 0.6,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#5f7da6',
    fontWeight: '500',
  },
  categoriesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 20,
    ...SHADOWS.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...SHADOWS.sm,
  },
  catEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f2c6e',
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  trackLiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  activeBookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  bookingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceAvatarEmoji: {
    fontSize: 22,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingServiceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  bookingWorkerName: {
    fontSize: 12,
    color: '#5f7da6',
    marginTop: 2,
    fontWeight: '600',
  },
  bookingCardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
  timePill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bookingTimeText: {
    fontSize: 11,
    color: '#5f7da6',
    fontWeight: '700',
  },
  noBookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  noBookingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  noBookingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f2c6e',
    marginBottom: 4,
  },
  noBookingSub: {
    fontSize: 13,
    color: '#5f7da6',
    textAlign: 'center',
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  shieldIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...SHADOWS.sm,
  },
  shieldEmoji: {
    fontSize: 20,
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 2,
  },
  guaranteeSub: {
    fontSize: 12,
    color: '#5f7da6',
    lineHeight: 16,
  },
});
