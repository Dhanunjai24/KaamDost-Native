import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassCategoryCard({
  trade,
  emoji = '👷',
  onPress,
  variant = 'card', // 'card' (compact grid) or 'banner' (row item)
  style
}) {
  const { theme, shadows } = useTheme();

  if (variant === 'banner') {
    return (
      <TouchableOpacity
        style={[
          styles.bannerCard,
          {
            backgroundColor: theme.glassSurface,
            borderColor: theme.border
          },
          shadows.glass,
          style
        ]}
        onPress={onPress}
        activeOpacity={0.78}
      >
        <View
          style={[
            styles.circularIconContainer,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.bannerEmoji}>{emoji}</Text>
        </View>

        <View style={styles.bannerInfo}>
          <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>
            {trade.name}
          </Text>
          <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
            {trade.telugu ? `${trade.telugu} • ` : ''}Verified labour • standard daily rate
          </Text>
        </View>

        <View style={styles.bannerRight}>
          <View style={[styles.ratePill, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.rateAmount, { color: theme.textPrimary }]}>
              ₹{trade.dailyRate}
            </Text>
            <Text style={[styles.rateUnit, { color: theme.textSecondary }]}>/day</Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Default grid card
  return (
    <TouchableOpacity
      style={[
        styles.gridCard,
        {
          backgroundColor: theme.glassSurface,
          borderColor: theme.border
        },
        shadows.glass,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <View
        style={[
          styles.circularIconContainer,
          {
            backgroundColor: theme.primaryLight,
            borderColor: theme.border,
            borderWidth: 1
          }
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text
        style={[styles.tradeName, { color: theme.textPrimary }]}
        numberOfLines={1}
      >
        {trade.name}
      </Text>

      {trade.telugu ? (
        <Text
          style={[styles.teluguName, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {trade.telugu}
        </Text>
      ) : null}

      <View style={[styles.rateBadge, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.rateText, { color: theme.textPrimary }]}>
          ₹{trade.dailyRate}/day
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  circularIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  emoji: {
    fontSize: 22
  },
  tradeName: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: -0.2
  },
  teluguName: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8
  },
  rateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  rateText: {
    fontSize: 10,
    fontWeight: '800'
  },

  // Banner row variant
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10
  },
  bannerEmoji: {
    fontSize: 22
  },
  bannerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  bannerSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6
  },
  rateAmount: {
    fontSize: 13,
    fontWeight: '800'
  },
  rateUnit: {
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600'
  },
  chevron: {
    fontSize: 20,
    fontWeight: '400'
  }
});
