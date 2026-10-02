import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Share,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ReferralRewardsScreen({
  onBack,
  customerId,
  authToken,
  apiBaseUrl = 'http://localhost:3000/api',
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  // Apply code input
  const [inputCode, setInputCode] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);
  const [applyMessage, setApplyMessage] = useState(null);

  const fetchReferralSummary = useCallback(async () => {
    try {
      setError(null);
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      if (customerId) {
        headers['x-customer-id'] = customerId;
      }

      const res = await fetch(`${apiBaseUrl}/customer/referrals/summary`, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setSummary(data);
      } else {
        setError(data.error || 'Failed to load referral details');
      }
    } catch (err) {
      setError(err.message || 'Network error loading referral data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiBaseUrl, authToken, customerId]);

  useEffect(() => {
    fetchReferralSummary();
  }, [fetchReferralSummary]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReferralSummary();
  };

  const referralCode = summary?.referralCode || 'KAAMDOST';
  const stats = summary?.stats || {
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    earnedRewards: 0,
    pendingRewards: 0,
  };
  const history = summary?.history || [];
  const referredBy = summary?.referredBy || null;

  const handleCopy = () => {
    setCopied(true);
    Alert.alert('Copied!', `Referral code ${referralCode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareMessage = `Join KaamDost with my referral code ${referralCode} and get ₹250 welcome bonus on verified home & labour services! Download now: https://kaamdost.com/join?ref=${referralCode}`;
    try {
      if (Share && Share.share) {
        await Share.share({
          message: shareMessage,
          title: 'Invite to KaamDost',
        });
      } else {
        Alert.alert('Share Referral', shareMessage);
      }
    } catch {
      Alert.alert('Share Referral', shareMessage);
    }
  };

  const handleApplyReferralCode = async () => {
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      Alert.alert('Input Error', 'Please enter a referral code.');
      return;
    }
    setApplyingCode(true);
    setApplyMessage(null);

    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      if (customerId) {
        headers['x-customer-id'] = customerId;
      }

      const res = await fetch(`${apiBaseUrl}/customer/referrals/apply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ referralCode: cleanCode })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        Alert.alert('Success!', data.message || 'Referral code applied successfully!');
        setInputCode('');
        fetchReferralSummary();
      } else {
        Alert.alert('Referral Error', data.error || 'Failed to apply referral code.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Network request failed.');
    } finally {
      setApplyingCode(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Rewards</Text>
          <View style={{ width: 42 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading referral information...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {/* Hero Illustration Box */}
            <View style={styles.giftCard}>
              <Text style={styles.giftEmoji}>🎁 👥 ✨</Text>
            </View>

            {/* Offer Heading */}
            <Text style={styles.offerTitle}>Give ₹100 Get ₹100</Text>
            <Text style={styles.offerSubtitle}>
              Friends get ₹250 welcome bonus, and you earn ₹100 when they complete their first service.
            </Text>

            {/* Referred By Banner (if applicable) */}
            {referredBy && (
              <View style={styles.referredBanner}>
                <Text style={styles.referredBannerText}>
                  🤝 You were referred using code <Text style={styles.boldText}>{referredBy.code}</Text>
                  {' '}(₹{referredBy.welcomeBonus || 250} welcome bonus credited)
                </Text>
              </View>
            )}

            {/* Referral Code Box */}
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Your Unique Referral Code</Text>
              <View style={styles.codeCard}>
                <Text style={styles.codeDigits}>{referralCode}</Text>
                <TouchableOpacity onPress={handleCopy} activeOpacity={0.75} style={styles.copyBtn}>
                  <Text style={styles.copyText}>{copied ? 'Copied! ✓' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Referrals</Text>
                <Text style={styles.statVal}>{stats.totalReferrals}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={[styles.statVal, { color: '#f59e0b' }]}>{stats.pendingReferrals}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Earned Rewards</Text>
                <Text style={styles.rewardVal}>₹{stats.earnedRewards}</Text>
              </View>
            </View>

            {/* Apply a Referral Code (if not yet referred) */}
            {!referredBy && (
              <View style={styles.applyContainer}>
                <Text style={styles.applyLabel}>Have a friend's referral code?</Text>
                <View style={styles.applyRow}>
                  <TextInput
                    style={styles.applyInput}
                    placeholder="Enter code (e.g. KD8888)"
                    placeholderTextColor="#94a3b8"
                    value={inputCode}
                    onChangeText={setInputCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={[styles.applyBtn, applyingCode && styles.applyBtnDisabled]}
                    onPress={handleApplyReferralCode}
                    disabled={applyingCode}
                    activeOpacity={0.8}
                  >
                    {applyingCode ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.applyBtnText}>Apply</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Referral History Section */}
            <View style={styles.historyContainer}>
              <Text style={styles.historyHeader}>Referral History ({history.length})</Text>
              {history.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Text style={styles.emptyHistoryEmoji}>🤝</Text>
                  <Text style={styles.emptyHistoryTitle}>No referrals yet</Text>
                  <Text style={styles.emptyHistorySubtitle}>
                    Share your referral code with friends and family to start earning rewards!
                  </Text>
                </View>
              ) : (
                history.map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.refereeName}>{item.refereeName}</Text>
                      <Text style={styles.historyDate}>
                        Joined {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                    <View style={styles.historyRight}>
                      <View style={[
                        styles.statusPill,
                        item.rewardStatus === 'CREDITED' ? styles.statusCredited : styles.statusPending
                      ]}>
                        <Text style={[
                          styles.statusPillText,
                          item.rewardStatus === 'CREDITED' ? styles.textCredited : styles.textPending
                        ]}>
                          {item.rewardStatus === 'CREDITED' ? 'Earned ₹100' : 'Pending First Service'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}

        {/* Share Now CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.88}
          >
            <Text style={styles.shareBtnText}>Share Referral Code</Text>
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
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
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
    paddingBottom: 24,
  },
  giftCard: {
    width: '100%',
    height: 120,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
  },
  giftEmoji: {
    fontSize: 44,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f294a',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  offerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
    marginBottom: 18,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  referredBanner: {
    width: '100%',
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  referredBannerText: {
    fontSize: 13,
    color: '#065f46',
    fontWeight: '600',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '800',
    color: '#047857',
  },
  codeContainer: {
    width: '100%',
    marginBottom: 16,
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
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563eb',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f294a',
    marginTop: 4,
  },
  rewardVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10b981',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  applyContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  applyLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  applyBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  historyContainer: {
    width: '100%',
  },
  historyHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 12,
  },
  emptyHistory: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyHistoryEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptyHistorySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyLeft: {
    flex: 1,
  },
  refereeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  historyDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  historyRight: {
    marginLeft: 10,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusCredited: {
    backgroundColor: '#d1fae5',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textCredited: {
    color: '#065f46',
  },
  textPending: {
    color: '#92400e',
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
