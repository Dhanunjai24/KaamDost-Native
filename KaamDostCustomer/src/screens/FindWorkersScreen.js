import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkerCard from '../components/WorkerCard';
import WorkerProfileModal from '../components/WorkerProfileModal';
import BookingModal from '../components/BookingModal';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassSearch from '../../../shared/components/glass/GlassSearch';
import GlassChip from '../../../shared/components/glass/GlassChip';
import { t } from '../../../shared/i18n';
import api from '../../../shared/api/client';

export default function FindWorkersScreen({ onBack, onBookingCreated }) {
  const { theme, shadows } = useTheme();
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const res = await api.getWorkers();
      const list = res.workers || [];
      setWorkers(list);
      setFilteredWorkers(list);
    } catch (e) {
      console.warn('Load workers fallback');
    }
  };

  const handleFilter = (tradeId, query) => {
    let list = [...workers];
    if (tradeId && tradeId !== 'all') {
      list = list.filter(w => w.trade === tradeId);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(w => w.name.toLowerCase().includes(q) || (w.tradeName || '').toLowerCase().includes(q));
    }
    setFilteredWorkers(list);
  };

  const onSelectTradeFilter = (tradeId) => {
    setSelectedTrade(tradeId);
    handleFilter(tradeId, searchQuery);
  };

  const onSearchText = (text) => {
    setSearchQuery(text);
    handleFilter(selectedTrade, text);
  };

  const handleOpenProfile = (worker) => {
    setSelectedWorker(worker);
    setShowProfileModal(true);
  };

  const handleBookDirect = (worker) => {
    setSelectedWorker(worker);
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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {t('findWorkers')}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Input Bar using GlassSearch */}
        <View style={styles.searchWrapper}>
          <GlassSearch
            value={searchQuery}
            onChangeText={onSearchText}
            placeholder="Search by name, mason, plumber..."
            onClear={() => onSearchText('')}
          />
        </View>

        {/* Trade Filter Pills using GlassChip */}
        <View style={styles.filterScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            <GlassChip
              label={`All Trades (${workers.length})`}
              selected={selectedTrade === 'all'}
              onPress={() => onSelectTradeFilter('all')}
            />
            {TRADES_CATALOG.map((tr) => (
              <GlassChip
                key={tr.id}
                label={tr.name}
                selected={selectedTrade === tr.id}
                onPress={() => onSelectTradeFilter(tr.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Worker List */}
        <FlatList
          data={filteredWorkers}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No Workers Found
              </Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                Try adjusting your search query or trade filter.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              onSelectWorker={handleOpenProfile}
              onBookDirect={handleBookDirect}
            />
          )}
        />

        {/* Profile Modal */}
        <WorkerProfileModal
          visible={showProfileModal}
          worker={selectedWorker}
          onClose={() => setShowProfileModal(false)}
          onBookDirect={(worker) => {
            setShowProfileModal(false);
            setShowBookingModal(true);
          }}
          onCallWorker={(worker) => {
            alert(`Connecting call to +91 ${worker.phone}`);
          }}
        />

        {/* Booking Modal */}
        <BookingModal
          visible={showBookingModal}
          worker={selectedWorker}
          onClose={() => setShowBookingModal(false)}
          onConfirmBooking={(booking) => {
            if (onBookingCreated) onBookingCreated(booking);
            onBack();
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
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  backBtn: {
    paddingRight: 8,
    paddingVertical: 4
  },
  backText: {
    fontSize: 22,
    fontWeight: '800'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4
  },
  filterScrollWrapper: {
    paddingVertical: 8
  },
  filterList: {
    paddingHorizontal: 16
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 30
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 240
  }
});
