import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

// Mapping trade icons to native emoji / visual glyphs
const TRADE_EMOJIS = {
  masonry: '🧱',
  electrical: '⚡',
  plumbing: '🔧',
  painting: '🎨',
  carpentry: '🪚',
  welding: '🔥',
  tile_marble: '📐',
  cleaning: '🧹',
  construction_labour: '👷',
  helper: '📦',
  driver: '🚚',
  centering: '🏗️',
  appliance_repair: '🛠️'
};

export default function ServiceGrid({ onSelectTrade }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{t('categories')}</Text>
          <Text style={styles.subtitle}>Verified Telangana labour across 13 core trades</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.viewAllText}>{t('viewAllTrades')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {TRADES_CATALOG.map((trade) => {
          const emoji = TRADE_EMOJIS[trade.id] || '👷';
          return (
            <TouchableOpacity
              key={trade.id}
              style={styles.card}
              onPress={() => onSelectTrade(trade)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: trade.bg }]}>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>
              <Text style={styles.tradeName} numberOfLines={1}>{trade.name}</Text>
              <Text style={styles.teluguName} numberOfLines={1}>{trade.telugu}</Text>
              <View style={styles.rateRow}>
                <Text style={styles.rateText}>₹{trade.dailyRate}/day</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  card: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  emoji: {
    fontSize: 20
  },
  tradeName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 2
  },
  teluguName: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 6
  },
  rateRow: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  rateText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark
  }
});
