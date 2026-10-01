import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function HeroBanner({
  searchQuery,
  onChangeSearch,
  onPressBookNow,
  onPressVoiceSearch
}) {
  return (
    <View style={styles.bannerCard}>
      {/* Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.tag}>
          <Text style={styles.tagDot}>●</Text>
          <Text style={styles.tagText}>Telangana Labour Mission Verified</Text>
        </View>
      </View>

      {/* Main Tagline */}
      <Text style={styles.heading}>
        Book Verified Skilled Workers in <Text style={styles.highlight}>60 Seconds</Text>
      </Text>
      <Text style={styles.subheading}>
        Masons, Electricians, Plumbers & Labourers at government-standard daily rates.
      </Text>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={onChangeSearch}
        />
        <TouchableOpacity
          style={styles.voiceBtn}
          onPress={onPressVoiceSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.voiceIcon}>🎙️</Text>
        </TouchableOpacity>
      </View>

      {/* Instant Action CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={onPressBookNow}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>⚡ {t('bookDostNow')}</Text>
      </TouchableOpacity>

      {/* Trust Stats Counter */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>10,000+</Text>
          <Text style={styles.statLbl}>Verified Workers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>4.8 ★</Text>
          <Text style={styles.statLbl}>Customer Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>₹0</Text>
          <Text style={styles.statLbl}>Advance Booking Fee</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.medium
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.4)'
  },
  tagDot: {
    color: COLORS.primary,
    fontSize: 8,
    marginRight: 4
  },
  tagText: {
    color: COLORS.primarySoft,
    fontSize: 11,
    fontWeight: '700'
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textWhite,
    lineHeight: 26,
    marginBottom: 6
  },
  highlight: {
    color: COLORS.primary
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 16
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 8
  },
  voiceBtn: {
    padding: 4
  },
  voiceIcon: {
    fontSize: 16
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...SHADOWS.small
  },
  ctaButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  },
  statLbl: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  }
});
