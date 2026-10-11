import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassCategoryCard from '../../../shared/components/glass/GlassCategoryCard';
import { useResponsive } from '../utils/responsive';
import { t } from '../../../shared/i18n';

// Mapping trade icons to native emoji glyphs
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

// Top popular trades requested across Telangana (8 popular trades = 2 rows of 4)
const POPULAR_TRADE_IDS = [
  'masonry',
  'electrical',
  'plumbing',
  'painting',
  'carpentry',
  'tile_marble',
  'welding',
  'construction_labour'
];

export default function ServiceGrid({ onSelectTrade, onViewAllTrades }) {
  const { theme, shadows } = useTheme();
  const { width, isTablet, isLandscape } = useResponsive();

  const numCols = isTablet ? (isLandscape ? 6 : 5) : 4;
  const colGap = 8;
  const colWidth = Math.floor((width - 32 - (numCols - 1) * colGap) / numCols);

  // Show only popular trade categories (8 items)
  const popularTrades = useMemo(() => {
    const list = TRADES_CATALOG.filter(t => POPULAR_TRADE_IDS.includes(t.id));
    return list.length > 0 ? list : TRADES_CATALOG.slice(0, 8);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t('categories')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Popular ground trades • Verified daily labour
          </Text>
        </View>

        {/* View All Trades button */}
        <TouchableOpacity
          style={[
            styles.viewAllBtn,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
          onPress={onViewAllTrades}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllText, { color: theme.accentPrimary }]}>
            View All Trades →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Popular Categories 4-Column Grid */}
      <View style={styles.grid}>
        {popularTrades.map((trade) => {
          const emoji = trade.emoji || TRADE_EMOJIS[trade.id] || '👷';
          return (
            <TouchableOpacity
              key={trade.id}
              style={[
                styles.card,
                {
                  width: '23.5%',
                  backgroundColor: theme.glassSurface,
                  borderColor: theme.border
                },
                shadows.small
              ]}
              onPress={() => onSelectTrade(trade)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: theme.primaryLight,
                    borderColor: theme.borderLight
                  }
                ]}
              >
                <Text style={styles.cardEmoji}>{emoji}</Text>
              </View>

              <Text
                style={[styles.cardName, { color: theme.textPrimary }]}
                numberOfLines={2}
              >
                {trade.name}
              </Text>

              {trade.telugu ? (
                <Text
                  style={[styles.cardTelugu, { color: theme.accentPrimary }]}
                  numberOfLines={1}
                >
                  {trade.telugu}
                </Text>
              ) : null}

              <View
                style={[
                  styles.rateBadge,
                  {
                    backgroundColor: theme.primaryLight,
                    borderColor: theme.borderLight
                  }
                ]}
              >
                <Text style={[styles.rateText, { color: theme.textPrimary }]}>
                  ₹{trade.dailyRate}
                  <Text style={styles.rateUnit}>/d</Text>
                </Text>
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
    alignItems: 'center',
    marginBottom: 14
  },
  headerTextCol: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2
  },
  viewAllBtn: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 8
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  cardEmoji: {
    fontSize: 20
  },
  cardName: {
    fontSize: 10.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 13,
    minHeight: 26,
    marginBottom: 2
  },
  cardTelugu: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4
  },
  rateBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center'
  },
  rateText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  rateUnit: {
    fontSize: 8.5,
    fontWeight: '600',
    marginLeft: 1
  }
});
