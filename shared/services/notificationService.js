import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/client';

/**
 * Direct service functions
 */
export async function fetchNotifications({ userId, role = 'worker' } = {}) {
  try {
    const res = await apiClient.getNotifications({ userId, role });
    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.warn('[NotificationService] fetchNotifications error:', error?.message || error);
    return [];
  }
}

export async function fetchUnreadCount({ userId, role = 'worker' } = {}) {
  try {
    const res = await apiClient.getUnreadNotificationCount({ userId, role });
    if (res && res.success && typeof res.unreadCount === 'number') {
      return res.unreadCount;
    }
    return 0;
  } catch (error) {
    console.warn('[NotificationService] fetchUnreadCount error:', error?.message || error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId, { userId, role = 'worker' } = {}) {
  try {
    return await apiClient.markNotificationRead(notificationId, { userId, role });
  } catch (error) {
    console.warn('[NotificationService] markNotificationAsRead error:', error?.message || error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead({ userId, role = 'worker' } = {}) {
  try {
    return await apiClient.markAllNotificationsRead({ userId, role });
  } catch (error) {
    console.warn('[NotificationService] markAllNotificationsAsRead error:', error?.message || error);
    return { success: false };
  }
}

export async function registerPushNotificationToken(token, { platform = 'android', userId, role = 'worker' } = {}) {
  try {
    return await apiClient.registerPushToken(token, { platform, userId, role });
  } catch (error) {
    console.warn('[NotificationService] registerPushNotificationToken error:', error?.message || error);
    return { success: false };
  }
}

/**
 * React Hook for seamless UI notification state, badge counts, and polling.
 */
export function useNotifications({ userId, role = 'worker', autoPolling = true, pollingInterval = 20000 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ userId, role });
      setNotifications(data);

      const unread = data.filter(n => n.unread || !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err?.message || 'Failed to load notifications');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [userId, role]);

  const markAsRead = useCallback(async (notificationId) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, unread: false, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Call server
    await markNotificationAsRead(notificationId, { userId, role });
  }, [userId, role]);

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false, read: true }))
    );
    setUnreadCount(0);

    // Call server
    await markAllNotificationsAsRead({ userId, role });
  }, [userId, role]);

  useEffect(() => {
    loadNotifications(false);

    if (autoPolling && pollingInterval > 0) {
      timerRef.current = setInterval(() => {
        loadNotifications(true);
      }, pollingInterval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadNotifications, autoPolling, pollingInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: () => loadNotifications(false),
    markAsRead,
    markAllAsRead,
    registerPushToken: (token, platform) => registerPushNotificationToken(token, { platform, userId, role })
  };
}

export default {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  registerPushNotificationToken,
  useNotifications
};
