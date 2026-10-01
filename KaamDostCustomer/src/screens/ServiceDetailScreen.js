import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
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
          {/* Hero Banner Card matching screen_12 */}
          <View style={styles.heroBannerCard}>
            <View style={styles.bannerArt}>
              <Text style={styles.bannerEmoji}>🧹 🏠 ✨</Text>
              <Text style={styles.bannerBadge}>Verified Pros</Text>
            </View>
          </View>

          {/* Service Title & Rating */}
          <View style={styles.infoCard}>
            <Text style={styles.serviceTitle}>{currentService.title}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>{currentService.rating || '4.8 (2.3k)'}</Text>
            </View>
            <Text style={styles.serviceDesc}>
              {currentService.description || 'Professional service for a cleaner home'}
            </Text>

            {/* Stat Badges Row matching screen_12 */}
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>⏱️</Text>
                <Text style={styles.statLabel}>{currentService.duration || '2-3 hrs'}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>👥</Text>
                <Text style={styles.statLabel}>{currentService.clients || '3.2k Clients'}</Text>
              </View>
              <View style={[styles.statPill, styles.statPillAvailable]}>
                <Text style={styles.availableDot}>●</Text>
                <Text style={styles.availableLabel}>Available</Text>
              </View>
            </View>
          </View>

          {/* What's Included Section matching screen_12 */}
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

          {/* Pricing Highlight */}
          <View style={styles.priceRowCard}>
            <View>
              <Text style={styles.priceLabel}>Base Rate</Text>
              <Text style={styles.priceAmount}>{currentService.price || '₹999'}</Text>
            </View>
            <View style={styles.protectionBadge}>
              <Text style={styles.protectionText}>Zero Hidden Fees ✓</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Continue CTA matching screen_12 */}
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
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  scrollContent: {
    paddingBottom: 20,
  },
  heroBannerCard: {
    height: 180,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    ...SHADOWS.medium,
  },
  bannerArt: {
    flex: 1,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerEmoji: {
    fontSize: 54,
  },
  bannerBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f294a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  starIcon: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  serviceDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 18,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    gap: 4,
  },
  statEmoji: {
    fontSize: 13,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f294a',
  },
  statPillAvailable: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  availableDot: {
    color: '#10b981',
    fontSize: 10,
  },
  availableLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  includedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  includedHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  checkMark: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '900',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f294a',
  },
  priceRowCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  priceLabel: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  protectionBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  protectionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  footer: {
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
