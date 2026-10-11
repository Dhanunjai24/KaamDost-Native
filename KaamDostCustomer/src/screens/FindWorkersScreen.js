import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TradeCard from '../components/TradeCard';
import BookingModal from '../components/BookingModal';
import VoiceSearchModal from '../components/VoiceSearchModal';
import { TRADES_CATALOG, TRADE_CATEGORIES } from '../../../shared/constants/trades';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassSearch from '../../../shared/components/glass/GlassSearch';
import GlassChip from '../../../shared/components/glass/GlassChip';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';
import { parseQueryWithLLM } from '../services/llmVoiceSearch';

export default function FindWorkersScreen({
  initialTradeFilter = 'all',
  initialSearchQuery = '',
  customer,
  onBack,
  onOpenHome,
  onOpenFindWorkers,
  onOpenBookings,
  onOpenTracking,
  onOpenDashboard,
  onBookingCreated
}) {
  const { theme, shadows } = useTheme();

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [llmMatchedTrade, setLlmMatchedTrade] = useState(null);

  // Sync initial props
  useEffect(() => {
    if (initialTradeFilter && initialTradeFilter !== 'all') {
      const match = TRADES_CATALOG.find(t => t.id === initialTradeFilter);
      if (match) {
        setSelectedCategory(match.category || 'All');
        setLlmMatchedTrade(match);
      }
    }
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      handleSemanticSearch(initialSearchQuery);
    }
  }, [initialTradeFilter, initialSearchQuery]);

  // Semantic LLM Query analysis
  const handleSemanticSearch = async (text) => {
    if (!text || !text.trim()) {
      setLlmMatchedTrade(null);
      return;
    }
    try {
      const result = await parseQueryWithLLM(text);
      if (result && result.matched && result.tradeId) {
        const found = TRADES_CATALOG.find(t => t.id === result.tradeId);
        setLlmMatchedTrade(found || result.matchedTrade);
      } else {
        setLlmMatchedTrade(null);
      }
    } catch (e) {
      setLlmMatchedTrade(null);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    handleSemanticSearch(text);
  };

  // Filtered trades list
  const filteredTrades = useMemo(() => {
    let list = [...TRADES_CATALOG];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(t => t.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => {
        const nameMatch = (t.name || '').toLowerCase().includes(q);
        const teluguMatch = (t.telugu || '').toLowerCase().includes(q);
        const categoryMatch = (t.category || '').toLowerCase().includes(q);
        const llmMatch = llmMatchedTrade ? t.id === llmMatchedTrade.id : false;
        return nameMatch || teluguMatch || categoryMatch || llmMatch;
      });
    }

    return list;
  }, [selectedCategory, searchQuery, llmMatchedTrade]);

  // Handle Book Action on Trade
  const handleBookTrade = (trade) => {
    setSelectedTrade(trade);
    setShowBookingModal(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.glassSurfaceStrong,
              borderBottomColor: theme.border
            },
            shadows.small
          ]}
        >
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Available Trades & Works
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Official Telangana daily rates • Instant dispatch
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar with LLM Voice */}
        <View style={styles.searchWrapper}>
          <GlassSearch
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search trade or Telugu slang (e.g. water tank, rangu)..."
            onClear={() => {
              setSearchQuery('');
              setLlmMatchedTrade(null);
            }}
            onVoicePress={() => setShowVoiceModal(true)}
          />

          {llmMatchedTrade ? (
            <View style={styles.llmBanner}>
              <Text style={styles.llmBannerText}>
                🎯 AI Matched Trade:{' '}
                <Text style={{ fontWeight: '800' }}>{llmMatchedTrade.name}</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setLlmMatchedTrade(null);
                  setSearchQuery('');
                }}
                style={styles.llmClearBtn}
              >
                <Text style={styles.llmClearText}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Category Pills Filter */}
        <View style={styles.categoryScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {TRADE_CATEGORIES.map((cat) => (
              <GlassChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => {
                  setSelectedCategory(cat);
                  setLlmMatchedTrade(null);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Available Trades & Works List */}
        <FlatList
          data={filteredTrades}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛠️</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No Trades Matching Query
              </Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                Try searching for colloquial terms like "water tank", "switchboard", or "rangu".
              </Text>
              <TouchableOpacity
                style={[styles.resetBtn, { backgroundColor: theme.accentPrimary }]}
                onPress={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setLlmMatchedTrade(null);
                }}
              >
                <Text style={styles.resetBtnText}>View All 46 Trades</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TradeCard
              trade={item}
              onBookTrade={handleBookTrade}
              isHighlighted={llmMatchedTrade && llmMatchedTrade.id === item.id}
            />
          )}
        />

        {/* Floating Capsule Bottom Navigation Bar */}
        <GlassFloatingBottomNav
          activeId="trades"
          onSelect={(id) => {
            if (id === 'book') setShowBookingModal(true);
            else if (id === 'home') (onOpenHome ? onOpenHome() : onBack());
            else if (id === 'bookings' || id === 'orders' || id === 'history') (onOpenBookings ? onOpenBookings() : (onOpenTracking ? onOpenTracking() : null));
            else if (id === 'wallet') (onOpenBookings ? onOpenBookings() : null);
            else if (id === 'profile') (onOpenDashboard ? onOpenDashboard() : null);
          }}
        />

        {/* Booking Modal */}
        <BookingModal
          visible={showBookingModal}
          trade={selectedTrade}
          customer={customer}
          onClose={() => setShowBookingModal(false)}
          onConfirmBooking={(booking) => {
            if (onBookingCreated) onBookingCreated(booking);
            onBack();
          }}
        />

        {/* AI Voice Search Modal */}
        <VoiceSearchModal
          visible={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onSelectResult={(tradeId, tradeName, query) => {
            setSearchQuery(query);
            const found = TRADES_CATALOG.find(t => t.id === tradeId);
            if (found) {
              setLlmMatchedTrade(found);
              setSelectedCategory(found.category || 'All');
            }
          }}
        />
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 8,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '700'
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4
  },
  llmBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6
  },
  llmBannerText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    flex: 1
  },
  llmClearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  llmClearText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700'
  },
  categoryScrollWrapper: {
    paddingVertical: 8
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8
  },
  list: {
    paddingTop: 4,
    paddingBottom: 100
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
