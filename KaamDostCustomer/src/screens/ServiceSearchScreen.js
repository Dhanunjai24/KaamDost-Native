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
    { id: 'cleaning', title: 'Home Cleaning', icon: '🧹', price: '₹999' },
    { id: 'plumbing', title: 'Plumbing', icon: '🔧', price: '₹849' },
    { id: 'electrician', title: 'Electrician', icon: '⚡', price: '₹899' },
  ];

  const recentSearches = [
    { id: 'r1', title: 'Deep Cleaning' },
    { id: 'r2', title: 'AC Repair' },
    { id: 'r3', title: 'Bathroom Cleaning' },
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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_11 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Search</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Search Input Box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search service..."
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
              {popularSearches.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.popularPill}
                  onPress={() => handlePick(item.title)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.popularPillText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Searches Section matching screen_11 */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((rec) => (
                <TouchableOpacity
                  key={rec.id}
                  style={styles.recentItem}
                  onPress={() => handlePick(rec.title)}
                  activeOpacity={0.75}
                >
                  <View style={styles.recentLeft}>
                    <Text style={styles.compassIcon}>🧭</Text>
                    <Text style={styles.recentTitle}>{rec.title}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
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
    backgroundColor: '#f0f7ff',
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
    marginBottom: 18,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 24,
    ...SHADOWS.small,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f294a',
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 15,
    color: '#94a3b8',
    paddingHorizontal: 6,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularPill: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    ...SHADOWS.small,
  },
  popularPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  recentList: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compassIcon: {
    fontSize: 18,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f294a',
  },
  chevron: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
