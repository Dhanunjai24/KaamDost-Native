import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { t } from '../../../shared/i18n';

export default function WorkerCard({ worker, onSelectWorker, onBookDirect }) {
  const { theme, shadows } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.border
        },
        shadows.glass
      ]}
      onPress={() => onSelectWorker(worker)}
      activeOpacity={0.82}
    >
      <View style={styles.topSection}>
        {/* Circular Avatar Container */}
        <View
          style={[
            styles.avatarContainer,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.avatarEmoji}>👷</Text>
          {worker.isAvailable && (
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: theme.success, borderColor: theme.surface }
              ]}
            />
          )}
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.name, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {worker.name}
            </Text>
            <View style={[styles.verifiedTag, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.verifiedText, { color: theme.success }]}>
                Verified ✓
              </Text>
            </View>
          </View>

          <Text style={[styles.trade, { color: theme.accentPrimary }]}>
            {worker.tradeName || worker.trade}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.rating, { color: theme.textPrimary }]}>
              ⭐ {worker.rating || '4.8'} ({worker.reviewsCount || '90+'})
            </Text>
            <Text style={[styles.dot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.exp, { color: theme.textSecondary }]}>
              {worker.experienceYears || '5'}+ yrs exp
            </Text>
            <Text style={[styles.dot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.distance, { color: theme.textSecondary }]}>
              📍 {worker.distance || '2.0 km'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomSection, { borderTopColor: theme.borderLight }]}>
        <View style={styles.wageCol}>
          <Text style={[styles.wageLabel, { color: theme.textSecondary }]}>
            {t('dailyRate')}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.wageValue, { color: theme.textPrimary }]}>
              ₹{worker.dailyRate || 850}
            </Text>
            <Text style={[styles.perDay, { color: theme.textSecondary }]}>/day</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.viewBtn,
              {
                backgroundColor: theme.glassSurface,
                borderColor: theme.border
              }
            ]}
            onPress={() => onSelectWorker(worker)}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewBtnText, { color: theme.textPrimary }]}>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookBtn,
              {
                backgroundColor: theme.buttonPrimary
              }
            ]}
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
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1.2
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
    borderWidth: 2
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
    fontWeight: '800',
    flex: 1,
    letterSpacing: -0.2
  },
  verifiedTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800'
  },
  trade: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    fontSize: 11,
    fontWeight: '700'
  },
  dot: {
    fontSize: 11,
    marginHorizontal: 4
  },
  exp: {
    fontSize: 11
  },
  distance: {
    fontSize: 11
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10
  },
  wageCol: {},
  wageLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  wageValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  perDay: {
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});
