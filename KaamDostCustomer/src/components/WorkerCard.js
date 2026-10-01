import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function WorkerCard({ worker, onSelectWorker, onBookDirect }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelectWorker(worker)}
      activeOpacity={0.8}
    >
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👷</Text>
          {worker.isAvailable && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{worker.name}</Text>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedText}>Verified ✓</Text>
            </View>
          </View>

          <Text style={styles.trade}>{worker.tradeName || worker.trade}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.rating}>⭐ {worker.rating || '4.8'} ({worker.reviewsCount || '90+'})</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.exp}>{worker.experienceYears || '5'}+ yrs exp</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.distance}>📍 {worker.distance || '2.0 km'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.wageCol}>
          <Text style={styles.wageLabel}>{t('dailyRate')}</Text>
          <Text style={styles.wageValue}>₹{worker.dailyRate || 850}<Text style={styles.perDay}>/day</Text></Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => onSelectWorker(worker)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewBtnText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => onBookDirect(worker)}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>⚡ {t('bookNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12
  },
  avatarEmoji: {
    fontSize: 26
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.onlineGreen,
    borderWidth: 2,
    borderColor: COLORS.surface
  },
  infoCol: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1
  },
  verifiedTag: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  verifiedText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700'
  },
  trade: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '600'
  },
  dot: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginHorizontal: 4
  },
  exp: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  distance: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10
  },
  wageCol: {},
  wageLabel: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  wageValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary
  },
  perDay: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '400'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textWhite
  }
});
