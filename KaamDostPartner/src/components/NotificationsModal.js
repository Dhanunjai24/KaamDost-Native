import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function NotificationsModal({
  visible,
  notifications = [],
  onClose,
  onMarkAllRead,
  onMarkRead
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('notifications')}</Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onMarkAllRead}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>Mark Read</Text>
          </TouchableOpacity>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You will be notified here when new service alerts or updates arrive.</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isUnread = item.unread !== undefined ? item.unread : !item.read;
              return (
                <TouchableOpacity
                  style={[styles.item, isUnread && styles.itemUnread]}
                  onPress={() => onMarkRead && onMarkRead(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>{item.icon || '📌'}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <View style={styles.titleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.timeText}>{item.time || ''}</Text>
                    </View>
                    <Text style={styles.descText}>{item.desc || item.body || ''}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  backBtn: {
    paddingRight: 8
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  clearBtn: {},
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary
  },
  list: {
    padding: 16,
    gap: 10
  },
  item: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  itemUnread: {
    borderColor: COLORS.primarySoft,
    backgroundColor: COLORS.surfaceCard
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  iconText: {
    fontSize: 18
  },
  infoCol: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18
  }
});
