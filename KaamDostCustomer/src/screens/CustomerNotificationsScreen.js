import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerNotificationsScreen({
  onBack,
  navigation,
  notifications: initialNotifications = null,
  onNotificationPress,
  onMarkRead,
  onMarkAllRead,
  loading: externalLoading = false,
  error: externalError = null,
  onRetry: externalRetry,
  customerId,
  apiBaseUrl = 'http://localhost:3000/api',
  authToken = null,
}) {
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [loading, setLoading] = useState(externalLoading || false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(externalError || null);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'BOOKING' | 'WORKER' | 'PAYMENT' | 'ACCOUNT'
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync with external notifications if provided
  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.filter(n => !n.read).length);
    }
  }, [initialNotifications]);

  useEffect(() => {
    setError(externalError);
  }, [externalError]);

  useEffect(() => {
    setLoading(externalLoading);
  }, [externalLoading]);

  // Fetch notifications from backend API
  const fetchNotifications = useCallback(async () => {
    if (initialNotifications && !refreshing) return;
    try {
      setLoading(true);
      setError(null);
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else if (customerId) {
        headers['x-customer-id'] = customerId;
      }

      const res = await fetch(`${apiBaseUrl}/customer/notifications?limit=50`, { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount || data.data.filter(n => !n.read).length);
      } else {
        throw new Error(data.error || 'Failed to load notifications');
      }
    } catch (err) {
      setError(err.message || 'Network error loading notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiBaseUrl, authToken, customerId, initialNotifications, refreshing]);

  useEffect(() => {
    if (!initialNotifications) {
      fetchNotifications();
    }
  }, [fetchNotifications, initialNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (onMarkAllRead) {
      onMarkAllRead();
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // Call backend
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      else if (customerId) headers['x-customer-id'] = customerId;
      await fetch(`${apiBaseUrl}/customer/notifications/mark-all-read`, { method: 'POST', headers });
    } catch (e) {}
  };

  const handlePressNotification = async (item) => {
    // Mark as read locally
    if (!item.read) {
      setNotifications(prev => prev.map(n => (n.id === item.id ? { ...n, read: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));

      if (onMarkRead) {
        onMarkRead(item.id);
      }

      // Call backend
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        else if (customerId) headers['x-customer-id'] = customerId;
        await fetch(`${apiBaseUrl}/customer/notifications/${item.id}/read`, { method: 'PATCH', headers });
      } catch (e) {}
    }

    if (onNotificationPress) {
      onNotificationPress(item);
      return;
    }

    // Default deep link navigation
    if (item.data && item.data.link) {
      const link = item.data.link;
      if (link.startsWith('#tracking/') && navigation) {
        const bookingId = link.replace('#tracking/', '');
        navigation.navigate('Tracking', { bookingId });
      } else if (link.startsWith('#booking/') && navigation) {
        const bookingId = link.replace('#booking/', '');
        navigation.navigate('BookingDetails', { bookingId });
      } else if (link.startsWith('#payment/') && navigation) {
        const bookingId = link.replace('#payment/', '');
        navigation.navigate('Payment', { bookingId });
      } else if (link === '#wallet' && navigation) {
        navigation.navigate('Wallet');
      }
    }
  };

  const getCategoryMeta = (item) => {
    const cat = String(item.category || '').toUpperCase();
    const type = String(item.type || '').toUpperCase();

    if (cat === 'PAYMENT' || type.includes('PAYMENT') || type.includes('REFUND')) {
      return { icon: '💳', bg: '#ecfdf5', border: '#a7f3d0', color: '#059669' };
    }
    if (cat === 'WORKER' || type.includes('WORKER') || type.includes('ARRIV')) {
      return { icon: '🚚', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' };
    }
    if (cat === 'ACCOUNT' || type.includes('WALLET') || type.includes('PROFILE')) {
      return { icon: '👛', bg: '#faf5ff', border: '#e9d5ff', color: '#9333ea' };
    }
    if (type.includes('COMPLETE')) {
      return { icon: '✅', bg: '#ecfdf5', border: '#a7f3d0', color: '#059669' };
    }
    if (type.includes('CANCEL')) {
      return { icon: '⚠️', bg: '#fef2f2', border: '#fecaca', color: '#dc2626' };
    }
    return { icon: '📋', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' };
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    return String(n.category || '').toUpperCase() === activeFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7} accessibilityLabel="Back">
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 ? (
            <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.readAllText}>Read All</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'BOOKING', label: 'Bookings' },
            { key: 'WORKER', label: 'Partner' },
            { key: 'PAYMENT', label: 'Payments' },
            { key: 'ACCOUNT', label: 'Account' }
          ].map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content States */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>Could not load notifications</Text>
            <Text style={styles.errorDesc}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={externalRetry || fetchNotifications}
              activeOpacity={0.7}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredNotifications.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.centerContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyDesc}>
              {activeFilter === 'ALL'
                ? "You're all caught up! Booking updates, partner activity, and alerts will appear here."
                : `No ${activeFilter.toLowerCase()} notifications found.`}
            </Text>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {filteredNotifications.map((item) => {
              const meta = getCategoryMeta(item);
              const isUnread = !item.read;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, isUnread && styles.cardUnread]}
                  onPress={() => handlePressNotification(item)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: meta.bg, borderColor: meta.border }
                    ]}
                  >
                    <Text style={styles.iconEmoji}>{meta.icon}</Text>
                  </View>

                  <View style={styles.textCol}>
                    <View style={styles.row}>
                      <Text style={[styles.cardTitle, isUnread && styles.cardTitleUnread]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatTime(item.createdAt || item.time)}
                      </Text>
                    </View>
                    <Text style={[styles.descText, isUnread && styles.descTextUnread]} numberOfLines={2}>
                      {item.body || item.desc}
                    </Text>

                    {item.data && item.data.bookingId && (
                      <View style={styles.tagRow}>
                        <View style={styles.bookingTag}>
                          <Text style={styles.bookingTagText}>
                            #{item.data.bookingId.replace('booking_', '')}
                          </Text>
                        </View>
                        {item.data.amount && (
                          <View style={styles.amountTag}>
                            <Text style={styles.amountTagText}>₹{item.data.amount}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>

                  {isUnread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  headerBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  readAllBtn: {
    backgroundColor: '#e0edfd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readAllText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  cardUnread: {
    borderColor: '#bfdbfe',
    backgroundColor: '#f8fbff',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
  },
  iconEmoji: {
    fontSize: 20,
  },
  textCol: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: {
    fontWeight: '800',
    color: '#0f294a',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  descText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500',
    lineHeight: 18,
  },
  descTextUnread: {
    color: '#334155',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  bookingTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  amountTag: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  amountTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 6,
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    ...SHADOWS.small,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
