import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ServiceSearchScreen({ onBack, onSelectService }) {
  const [query, setQuery] = useState('');

  const popularSearches = [
    'Home Cleaning',
    'Plumbing',
    'Electrician',
  ];

  const recentSearches = [
    { id: 'r1', title: 'Deep Cleaning', icon: '🎯' },
    { id: 'r2', title: 'AC Repair', icon: '🕒' },
    { id: 'r3', title: 'Bathroom Cleaning', icon: '🕒' },
  ];

  const handlePick = (term) => {
    setQuery(term);
    if (onSelectService) {
      onSelectService({
        id: 'cleaning',
        title: term,
        subtitle: 'Professional verified service',
        price: '₹999',
        rating: '4.8 (2.3k)',
        duration: '2-3 hrs',
        included: [
          'Living room cleaning',
          'Kitchen cleaning',
          'Bathroom cleaning',
          'Floor cleaning',
        ],
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header matching screen_11 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Search</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Active Frosted Search Input Box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services...."
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Popular Searches Section matching screen_11 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Popular Searches</Text>
            <View style={styles.pillsRow}>
              {popularSearches.map((title, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.popularPill}
                  onPress={() => handlePick(title)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.popularPillText}>{title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Searches Section matching screen_11 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentItem}
                  onPress={() => handlePick(item.title)}
                  activeOpacity={0.75}
                >
                  <View style={styles.recentLeft}>
                    <Text style={styles.clockIcon}>{item.icon}</Text>
                    <Text style={styles.recentText}>{item.title}</Text>
                  </View>
                  <Text style={styles.recentArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f2c6e',
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 26,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...SHADOWS.sm,
  },
  popularPillText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clockIcon: {
    fontSize: 16,
  },
  recentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  recentArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
