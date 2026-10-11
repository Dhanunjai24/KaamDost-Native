import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { TRADE_ICONS } from '../services/llmVoiceSearch';

export default function TradeCard({ trade, onBookTrade, isHighlighted }) {
  const { theme, shadows } = useTheme();

  const emoji = trade.emoji || TRADE_ICONS[trade.id] || '🛠️';
  const dailyRate = trade.dailyRate || 850;
  const halfDayRate = Math.round(dailyRate * 0.55);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: isHighlighted ? theme.accentPrimary : theme.border
        },
        isHighlighted && styles.highlightedCard,
        shadows.small
      ]}
    >
      {/* Top Row: Emoji Icon, Names, Category Pill */}
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: trade.bg || theme.primaryLight }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.titleBadgeRow}>
            <Text style={[styles.tradeName, { color: theme.textPrimary }]} numberOfLines={1}>
              {trade.name}
            </Text>
          </View>

          {trade.telugu ? (
            <Text style={[styles.teluguName, { color: theme.textSecondary }]}>
              {trade.telugu}
            </Text>
          ) : null}

          <View style={styles.tagRow}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.categoryText, { color: theme.accentPrimary }]}>
                {trade.category || 'General'}
              </Text>
            </View>
            <View style={styles.availabilityBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.availabilityText}>
                {trade.count || 'Available Near You'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

      {/* Bottom Row: Pricing & Book Now Action */}
      <View style={styles.bottomRow}>
        <View style={styles.priceCol}>
          <Text style={[styles.rateLabel, { color: theme.textMuted }]}>
            OFFICIAL TELANGANA RATE
          </Text>
          <View style={styles.rateRow}>
            <Text style={[styles.dailyRate, { color: theme.textPrimary }]}>
              ₹{dailyRate}
            </Text>
            <Text style={[styles.perDay, { color: theme.textSecondary }]}>/day</Text>
            <Text style={[styles.halfDay, { color: theme.textMuted }]}>
              (₹{halfDayRate}/half-day)
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: theme.accentPrimary }]}
          onPress={() => onBookTrade(trade)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookBtnText}>Book Work ➜</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12
  },
  highlightedCard: {
    borderWidth: 2,
    backgroundColor: '#F0FDF4'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: {
    fontSize: 24
  },
  infoCol: {
    flex: 1
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tradeName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  teluguName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#E5E7EB'
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700'
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981'
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669'
  },
  divider: {
    height: 1,
    marginVertical: 10
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceCol: {
    justifyContent: 'center'
  },
  rateLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2
  },
  dailyRate: {
    fontSize: 17,
    fontWeight: '900'
  },
  perDay: {
    fontSize: 11,
    fontWeight: '600'
  },
  halfDay: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
