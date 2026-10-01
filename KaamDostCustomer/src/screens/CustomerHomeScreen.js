import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />

      {/* Top Header matching screen_09 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Good Morning, {customer?.name ? customer.name.split(' ')[0] : 'Rahul'}</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              📍 {customer?.address?.street || '123 Green Park, New Delhi'}
            </Text>
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
        {/* Search Bar matching screen_09 */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onOpenSearch}
          activeOpacity={0.9}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search services....</Text>
        </TouchableOpacity>

        {/* Quick Categories Section matching screen_09 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={onOpenCategories}>
            <Text style={styles.seeAllText}>See all →</Text>
          </TouchableOpacity>
        </View>

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
                  {activeBooking.tradeName || 'Deep Cleaning'}
                </Text>
                <Text style={styles.bookingWorkerName}>
                  {activeBooking.workerName || 'Rohit Kumar'} • Door Cleaning
                </Text>
              </View>
            </View>

            <View style={styles.bookingCardRight}>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>In Progress</Text>
              </View>
              <Text style={styles.bookingTimeText}>
                {activeBooking.estimatedArrival ? `ETA ${activeBooking.estimatedArrival}` : '11:15 AM'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noBookingCard}>
            <Text style={styles.noBookingEmoji}>✨</Text>
            <Text style={styles.noBookingTitle}>No active orders right now</Text>
            <Text style={styles.noBookingSub}>Choose any service above to book verified local workers.</Text>
          </View>
        )}

        {/* Telangana Labour Guarantee Card */}
        <View style={styles.guaranteeCard}>
          <View style={styles.shieldIconBox}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
          </View>
          <View style={styles.guaranteeTextCol}>
            <Text style={styles.guaranteeHeading}>100% Fair Wage & Safety Protection</Text>
            <Text style={styles.guaranteeSub}>
              Zero platform commissions deducted from workers. Covered with ₹5,00,000 labour insurance.
            </Text>
          </View>
        </View>

        {/* Bottom spacing before tab bar */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 5-Tab Bottom Navigation Bar matching screen_09 */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#f0f7ff',
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
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...SHADOWS.small,
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
    color: '#0f294a',
    letterSpacing: -0.3,
  },
  locationText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  trackLiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563eb',
  },
  categoriesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 22,
    ...SHADOWS.small,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: '24%',
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f294a',
    textAlign: 'center',
    lineHeight: 15,
  },
  activeBookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    ...SHADOWS.medium,
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
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceAvatarEmoji: {
    fontSize: 24,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingServiceName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f294a',
  },
  bookingWorkerName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  bookingCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563eb',
  },
  bookingTimeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  noBookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  noBookingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  noBookingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  noBookingSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  guaranteeCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  shieldIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shieldEmoji: {
    fontSize: 22,
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e3a8a',
  },
  guaranteeSub: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 3,
    lineHeight: 16,
    fontWeight: '500',
  },
});
