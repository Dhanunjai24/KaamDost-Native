import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassCategoryCard from '../../../shared/components/glass/GlassCategoryCard';
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

export default function ServiceGrid({ onSelectTrade }) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t('categories')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Verified Telangana labour across 13 core trades
          </Text>
        </View>

        {/* View mode toggle (Grid / List) */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              backgroundColor: 'transparent',
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
          onPress={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { color: theme.textPrimary }]}>
            {viewMode === 'grid' ? '☰ List' : '☵ Grid'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid or List Display */}
      {viewMode === 'grid' ? (
        <View style={styles.grid}>
          {TRADES_CATALOG.map((trade) => {
            const emoji = TRADE_EMOJIS[trade.id] || '👷';
            return (
              <View key={trade.id} style={styles.gridCol}>
                <GlassCategoryCard
                  trade={trade}
                  emoji={emoji}
                  onPress={() => onSelectTrade(trade)}
                  variant="card"
                />
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.listView}>
          {TRADES_CATALOG.map((trade) => {
            const emoji = TRADE_EMOJIS[trade.id] || '👷';
            return (
              <GlassCategoryCard
                key={trade.id}
                trade={trade}
                emoji={emoji}
                onPress={() => onSelectTrade(trade)}
                variant="banner"
              />
            );
          })}
        </View>
      )}
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
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  gridCol: {
    width: '31%',
    marginBottom: 8
  },
  listView: {
    paddingTop: 2
  }
});
