import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ReferralRewardsScreen({ onBack }) {
  const [copied, setCopied] = useState(false);
  const referralCode = 'KD123456';

  const handleCopy = () => {
    setCopied(true);
    Alert.alert('Copied!', `Referral code ${referralCode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    Alert.alert(
      'Share Referral',
      `Use my code ${referralCode} to get ₹100 discount on your first KaamDost booking!`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_25 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Rewards</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Illustration Box */}
          <View style={styles.giftCard}>
            <Text style={styles.giftEmoji}>🎁 👥 ✨</Text>
          </View>

          {/* Offer Heading matching screen_25 */}
          <Text style={styles.offerTitle}>Give ₹100 Get ₹100</Text>
          <Text style={styles.offerSubtitle}>Invite friends and earn rewards</Text>

          {/* Referral Code Box matching screen_25 */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeCard}>
              <Text style={styles.codeDigits}>{referralCode}</Text>
              <TouchableOpacity onPress={handleCopy} activeOpacity={0.75}>
                <Text style={styles.copyText}>{copied ? 'Copied! ✓' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Row matching screen_25 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Referrals</Text>
              <Text style={styles.statVal}>5</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Earned Rewards</Text>
              <Text style={styles.rewardVal}>₹500</Text>
            </View>
          </View>
        </ScrollView>

        {/* Share Now CTA matching screen_25 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.88}
          >
            <Text style={styles.shareBtnText}>Share Now</Text>
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
    paddingBottom: 24,
    justifyContent: 'space-between',
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
    alignItems: 'center',
    paddingBottom: 20,
  },
  giftCard: {
    width: '100%',
    height: 140,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
  },
  giftEmoji: {
    fontSize: 50,
  },
  offerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f294a',
    letterSpacing: -0.5,
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
    marginBottom: 24,
  },
  codeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  codeDigits: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1d4ed8',
    letterSpacing: 2,
  },
  copyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f294a',
    marginTop: 4,
  },
  rewardVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#10b981',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  footer: {
    paddingTop: 10,
  },
  shareBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
