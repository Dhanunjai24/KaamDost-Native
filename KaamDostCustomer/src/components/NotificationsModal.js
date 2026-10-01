import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Partner Dispatched', desc: 'Ramesh Reddy (Mason) is arriving at your location.', time: '5m ago', icon: '🚚', unread: true },
  { id: '2', title: 'Welcome Bonus Credited', desc: '₹100 introductory discount added to your wallet.', time: '1h ago', icon: '🎁', unread: true },
  { id: '3', title: 'KYC Verified 100%', desc: 'Your Aadhaar and selfie verification was approved.', time: '1d ago', icon: '🛡️', unread: false }
];

export default function NotificationsModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('notifications')}</Text>
          <TouchableOpacity style={styles.clearBtn}>
            <Text style={styles.clearText}>Mark Read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.item, item.unread && styles.itemUnread]}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.infoCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.descText}>{item.desc}</Text>
              </View>
            </View>
          )}
        />
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
  }
});
