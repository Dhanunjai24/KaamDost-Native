import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ServiceDetailScreen({
  service,
  onBack,
  onContinue,
}) {
  const currentService = service || {
    id: 'cleaning',
    title: 'Home Cleaning',
    price: '₹999',
    rating: '4.8 (2.3k)',
    duration: '2-3 hrs',
    clients: '3.2k Clients',
    description: 'Professional service for a cleaner home',
    included: [
      'Living room cleaning',
      'Kitchen cleaning',
      'Bathroom cleaning',
      'Floor cleaning',
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header matching screen_12 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Selection</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Rounded Service Hero Banner Image Card */}
          <View style={styles.heroBannerCard}>
            <View style={styles.bannerArt}>
              <Text style={styles.bannerEmoji}>🧹 ✨ 🏠</Text>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>100% Verified Dosts</Text>
              </View>
            </View>
          </View>

          {/* Details Card */}
          <View style={styles.infoCard}>
            <View style={styles.titleRow}>
              <Text style={styles.serviceTitle}>{currentService.title}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingText}>{currentService.rating || '4.8 (2.3k)'}</Text>
              </View>
            </View>

            <Text style={styles.serviceSubtitle}>
              {currentService.description || 'Professional service for a cleaner home'}
            </Text>

            {/* Metadata Row: Frosted badges for 🕒 2-3 hrs, 👥 3.2k Clients, ⏱️ Available (green text) */}
            <View style={styles.metadataRow}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaIcon}>🕒</Text>
                <Text style={styles.metaLabel}>{currentService.duration || '2-3 hrs'}</Text>
              </View>

              <View style={styles.metaBadge}>
                <Text style={styles.metaIcon}>👥</Text>
                <Text style={styles.metaLabel}>{currentService.clients || '3.2k Clients'}</Text>
              </View>

              <View style={[styles.metaBadge, styles.metaBadgeAvailable]}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaLabelAvailable}>Available</Text>
              </View>
            </View>
          </View>

          {/* "What's Included" Checklist */}
          <View style={styles.includedCard}>
            <Text style={styles.includedHeading}>What's Included</Text>
            <View style={styles.checklist}>
              {(currentService.included || [
                'Living room cleaning',
                'Kitchen cleaning',
                'Bathroom cleaning',
                'Floor cleaning',
              ]).map((item, index) => (
                <View key={index} style={styles.checkRow}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                  <Text style={styles.checkLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Sticky Bottom CTA: "Continue" */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => onContinue && onContinue(currentService)}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
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
  scrollContent: {
    paddingBottom: 16,
  },
  heroBannerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.90)',
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  bannerArt: {
    height: 140,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerEmoji: {
    fontSize: 44,
  },
  bannerBadge: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563eb',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  starIcon: {
    color: '#f59e0b',
    fontSize: 13,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  serviceSubtitle: {
    fontSize: 13,
    color: '#5f7da6',
    fontWeight: '500',
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 6,
  },
  metaBadgeAvailable: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  metaIcon: {
    fontSize: 13,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  metaLabelAvailable: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
  },
  includedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    ...SHADOWS.md,
  },
  includedHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 14,
  },
  checklist: {
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 13,
    fontWeight: '900',
    color: '#16a34a',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f2c6e',
  },
  footer: {
    paddingTop: 8,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryBtn,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
