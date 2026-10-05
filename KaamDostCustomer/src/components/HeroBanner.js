import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassSearch from '../../../shared/components/glass/GlassSearch';
import GlassButton from '../../../shared/components/glass/GlassButton';
import { t } from '../../../shared/i18n';

export default function HeroBanner({
  searchQuery,
  onChangeSearch,
  onPressBookNow,
  onPressVoiceSearch
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.bannerCard,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.borderStrong
        },
        shadows.medium
      ]}
    >
      {/* Telangana Labour Mission Badge */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border
            }
          ]}
        >
          <Text style={[styles.tagDot, { color: theme.accentPrimary }]}>●</Text>
          <Text style={[styles.tagText, { color: theme.textPrimary }]}>
            Telangana Labour Mission Verified
          </Text>
        </View>
      </View>

      {/* Main Tagline */}
      <Text style={[styles.heading, { color: theme.textPrimary }]}>
        Book Verified Skilled Workers in{' '}
        <Text style={{ color: theme.accentPrimary }}>60 Seconds</Text>
      </Text>
      <Text style={[styles.subheading, { color: theme.textSecondary }]}>
        Masons, Electricians, Plumbers & Labourers at government-standard daily rates.
      </Text>

      {/* Search Input Bar using GlassSearch */}
      <GlassSearch
        value={searchQuery}
        onChangeText={onChangeSearch}
        placeholder={t('searchPlaceholder')}
        onVoicePress={onPressVoiceSearch}
        style={{ marginBottom: 12 }}
      />

      {/* Instant Action Primary CTA Button */}
      <GlassButton
        title={`⚡ ${t('bookDostNow')}`}
        onPress={onPressBookNow}
        variant="primary"
        size="md"
        style={{ marginBottom: 14 }}
      />

      {/* Trust Stats Counter - Prominent Numbers */}
      <View style={[styles.statsRow, { borderTopColor: theme.borderLight }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.textPrimary }]}>10,000+</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>
            Verified Workers
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.borderLight }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.textPrimary }]}>4.8 ★</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>
            Customer Rating
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.borderLight }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: theme.textPrimary }]}>₹0</Text>
          <Text style={[styles.statLbl, { color: theme.textSecondary }]}>
            Advance Booking Fee
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1
  },
  tagDot: {
    fontSize: 8,
    marginRight: 5
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800'
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 6,
    letterSpacing: -0.4
  },
  subheading: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  statLbl: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600'
  },
  statDivider: {
    width: 1,
    height: 22
  }
});
