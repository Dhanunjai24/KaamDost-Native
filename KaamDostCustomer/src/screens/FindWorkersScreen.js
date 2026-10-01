import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import WorkerCard from '../components/WorkerCard';
import WorkerProfileModal from '../components/WorkerProfileModal';
import BookingModal from '../components/BookingModal';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';
import api from '../../../shared/api/client';

export default function FindWorkersScreen({ onBack, onBookingCreated }) {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('findWorkers')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by worker name, masonry, plumber..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={onSearchText}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchText('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Trade Filter Pills */}
      <View style={styles.filterScrollWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          <TouchableOpacity
            style={[styles.filterPill, selectedTrade === 'all' && styles.filterPillActive]}
            onPress={() => onSelectTradeFilter('all')}
          >
            <Text style={[styles.filterText, selectedTrade === 'all' && styles.filterTextActive]}>
              All Trades ({workers.length})
            </Text>
          </TouchableOpacity>
          {TRADES_CATALOG.map((tr) => {
            const active = selectedTrade === tr.id;
            return (
              <TouchableOpacity
                key={tr.id}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => onSelectTradeFilter(tr.id)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {tr.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Worker List */}
      <FlatList
        data={filteredWorkers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Workers Found</Text>
            <Text style={styles.emptyDesc}>Try changing your search keyword or selected trade filter.</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  backBtn: {
    paddingRight: 8
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 10
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.textMuted,
    padding: 4
  },
  filterScrollWrapper: {
    marginBottom: 8
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  filterTextActive: {
    color: COLORS.textWhite,
    fontWeight: '700'
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20
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
    color: COLORS.textPrimary
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  }
});
