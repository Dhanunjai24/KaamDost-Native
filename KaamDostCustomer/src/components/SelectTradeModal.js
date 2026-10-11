import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions
} from 'react-native';
import { TRADES_CATALOG, TRADE_CATEGORIES } from '../../../shared/constants/trades';
import { useTheme } from '../../../shared/theme/ThemeContext';
import { useResponsive } from '../utils/responsive';

export default function SelectTradeModal({ visible, onClose, onSelectTrade }) {
  const { theme, shadows } = useTheme();
  const { width, isTablet, isLandscape, fontSize: rFontSize } = useResponsive();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Small 4-column responsive layout
  const columns = isTablet ? (isLandscape ? 6 : 5) : 4;
  const hPadding = 24; // 12 on each side
  const gap = 6;
  const cardWidth = Math.floor((width - hPadding - (columns - 1) * gap) / columns);

  const filteredTrades = useMemo(() => {
    let list = TRADES_CATALOG;
    if (activeCategory && activeCategory !== 'All') {
      list = list.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          (t.telugu && t.telugu.includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  const handleSelect = (trade) => {
    onSelectTrade(trade);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderColor: theme.borderStrong
            },
            shadows.large
          ]}
        >
          {/* Header Drag Handle */}
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: theme.borderStrong }]} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <View style={styles.headerTitleWrap}>
                <Text style={styles.headerSparkle}>⚡</Text>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Select Your Trade
                </Text>
              </View>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Choose verified skilled workers at Telangana standard wages
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.primaryLight }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeText, { color: theme.textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.glassSurface,
                borderColor: theme.border
              }
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search trade (Mason, Electrician, Plumber...)"
              placeholderTextColor={theme.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={[styles.clearSearch, { color: theme.textMuted }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Chips Horizontal Scroll */}
          <View style={styles.chipsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {TRADE_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.buttonPrimary : theme.primaryLight,
                        borderColor: isSelected ? theme.buttonPrimary : theme.border
                      }
                    ]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? theme.buttonPrimaryText : theme.textPrimary }
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Results Counter & Telangana Labour Guarantee Tag */}
          <View style={styles.resultsInfoRow}>
            <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
              {filteredTrades.length} Trade{filteredTrades.length === 1 ? '' : 's'} Available
            </Text>
            <View style={[styles.guaranteeBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.guaranteeText, { color: theme.accentPrimary }]}>
                ✓ Zero Cut Guarantee
              </Text>
            </View>
          </View>

          {/* Trades Small 4-Column Grid */}
          <ScrollView
            style={styles.tradesScrollView}
            contentContainerStyle={styles.tradesGridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.gridRow}>
              {filteredTrades.map((trade) => (
                <TouchableOpacity
                  key={trade.id}
                  style={[
                    styles.gridCard,
                    {
                      width: '23.5%',
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border
                    },
                    shadows.small
                  ]}
                  onPress={() => handleSelect(trade)}
                  activeOpacity={0.75}
                >
                  {/* Trade Emoji Icon */}
                  <View
                    style={[
                      styles.gridIconCircle,
                      {
                        backgroundColor: theme.primaryLight,
                        borderColor: theme.borderLight
                      }
                    ]}
                  >
                    <Text style={styles.gridEmoji}>{trade.emoji || '👷'}</Text>
                  </View>

                  {/* Trade Name */}
                  <Text
                    style={[styles.gridTradeName, { color: theme.textPrimary }]}
                    numberOfLines={2}
                  >
                    {trade.name}
                  </Text>

                  {/* Telugu translation */}
                  {trade.telugu ? (
                    <Text
                      style={[styles.gridTeluguName, { color: theme.accentPrimary }]}
                      numberOfLines={1}
                    >
                      {trade.telugu}
                    </Text>
                  ) : null}

                  {/* Category Chip */}
                  <Text
                    style={[styles.gridCategoryText, { color: theme.textMuted }]}
                    numberOfLines={1}
                  >
                    {trade.category}
                  </Text>

                  {/* Wage Rate Tag */}
                  <View
                    style={[
                      styles.rateContainer,
                      {
                        backgroundColor: theme.primaryLight,
                        borderColor: theme.borderLight
                      }
                    ]}
                  >
                    <Text style={[styles.gridRate, { color: theme.textPrimary }]}>
                      ₹{trade.dailyRate}
                      <Text style={styles.gridRateUnit}>/d</Text>
                    </Text>
                  </View>

                  {/* Compact Book Button */}
                  <View
                    style={[
                      styles.selectBtn,
                      { backgroundColor: theme.buttonPrimary }
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectBtnText,
                        { color: theme.buttonPrimaryText }
                      ]}
                    >
                      Book →
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {filteredTrades.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔎</Text>
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  No trades found
                </Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  Try searching for another keyword or switch category to "All".
                </Text>
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 35, 65, 0.55)'
  },
  backdrop: {
    flex: 1
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    maxHeight: '88%',
    paddingBottom: 20
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.5
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 12
  },
  titleCol: {
    flex: 1
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  headerSparkle: {
    fontSize: 20
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  closeText: {
    fontSize: 14,
    fontWeight: '800'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8
  },
  clearSearch: {
    fontSize: 14,
    padding: 6
  },
  chipsWrapper: {
    marginBottom: 8
  },
  categoryScroll: {
    paddingHorizontal: 18,
    gap: 8
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '700'
  },
  guaranteeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  guaranteeText: {
    fontSize: 10.5,
    fontWeight: '800'
  },
  tradesScrollView: {
    paddingHorizontal: 12
  },
  tradesGridContent: {
    paddingTop: 4,
    paddingBottom: 24
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginBottom: 6
  },
  gridIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3
  },
  gridEmoji: {
    fontSize: 19
  },
  gridTradeName: {
    fontSize: 9.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 12,
    minHeight: 24,
    marginBottom: 1
  },
  gridTeluguName: {
    fontSize: 8.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 1
  },
  gridCategoryText: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 3
  },
  rateContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1.5,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 3
  },
  gridRate: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: -0.2
  },
  gridRateUnit: {
    fontSize: 7.5,
    fontWeight: '600',
    marginLeft: 1
  },
  selectBtn: {
    width: '100%',
    paddingVertical: 2.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectBtnText: {
    fontSize: 8.5,
    fontWeight: '800'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%'
  },
  emptyEmoji: {
    fontSize: 38,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20
  }
});
