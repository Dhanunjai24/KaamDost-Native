import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerProfileScreen({
  customer,
  onBack,
  onOpenBookings,
  onOpenAddresses,
  onOpenWallet,
  onOpenNotifications,
  onOpenReferrals,
  onOpenLanguage,
  onOpenSupport,
  onLogout,
  onTabPress,
}) {
  const menuItems = [
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: '📋',
      action: onOpenBookings,
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      icon: '📍',
      action: onOpenAddresses,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: '👛',
      action: onOpenWallet,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      action: onOpenNotifications,
    },
    {
      id: 'referrals',
      label: 'Referral Rewards',
      icon: '🎁',
      action: onOpenReferrals,
    },
    {
      id: 'language',
      label: 'Language / భాష',
      icon: '🌐',
      action: onOpenLanguage,
    },
    {
      id: 'settings',
      label: 'Help & Settings',
      icon: '⚙️',
      action: onOpenSupport,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_26 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* User Profile Card matching screen_26 */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👨</Text>
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.userName}>{customer?.name || 'Rahul Sharma'}</Text>
              <Text style={styles.userEmail}>rahul@email.com • +91 {customer?.phone || '9876543210'}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.verifiedBadge}>100% UIDAI Verified ✓</Text>
              </View>
            </View>
          </View>

          {/* Menu Items List matching screen_26 */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.action}
                activeOpacity={0.75}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconCircle}>
                    <Text style={styles.menuEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 5-Tab Bottom Navigation matching screen_26 */}
        <BottomTabBar activeTab="Profile" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f294a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 6,
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8faff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  chevron: {
    fontSize: 22,
    color: '#94a3b8',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
