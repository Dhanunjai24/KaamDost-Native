import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ReviewsRatingScreen({
  bookingId,
  workerId,
  workerName = 'Partner Worker',
  serviceName = 'Home Service',
  onClose,
  onSubmitReview,
  customerId,
  authToken,
  apiBaseUrl = 'http://localhost:3000/api',
}) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedBadges, setSelectedBadges] = useState(['⚡ Super Punctual', '🧰 Clean & Tidy Work']);
  const [selectedTip, setSelectedTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);

  const complimentBadges = [
    '⚡ Super Punctual',
    '🧰 Clean & Tidy Work',
    '🛡️ Safety Compliant',
    '🤝 Polite & Friendly',
    '🔧 Master Skill'
  ];

  const tipOptions = [0, 30, 50, 100];

  const fetchEligibility = useCallback(async () => {
    if (!bookingId) return;
    try {
      setCheckingEligibility(true);
      setError(null);
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      else if (customerId) headers['x-customer-id'] = customerId;

      const res = await fetch(`${apiBaseUrl}/customer/bookings/${bookingId}/review/eligibility`, { headers });
      const data = await res.json();

      if (data.success && data.data) {
        setEligibility(data.data);
        if (data.data.existingReview) {
          const prev = data.data.existingReview;
          setRating(prev.rating || 5);
          setReviewText(prev.review || '');
          if (Array.isArray(prev.badges) && prev.badges.length > 0) {
            setSelectedBadges(prev.badges);
          }
          if (prev.tip != null) {
            setSelectedTip(prev.tip);
          }
          setIsEditMode(true);
        }
      } else {
        setError(data.error || 'Failed to verify review eligibility');
      }
    } catch (err) {
      setError(err.message || 'Network error verifying eligibility');
    } finally {
      setCheckingEligibility(false);
    }
  }, [apiBaseUrl, authToken, bookingId, customerId]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  const toggleBadge = (badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = async () => {
    if (!rating || rating < 1 || rating > 5) {
      Alert.alert('Invalid Rating', 'Please select between 1 and 5 stars.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        rating,
        review: reviewText.trim() || 'Work completed professionally.',
        badges: selectedBadges,
        tip: selectedTip,
        workerId: workerId || (eligibility?.worker?.id),
        isEdit: isEditMode
      };

      if (onSubmitReview) {
        await onSubmitReview(payload);
        Alert.alert('Review Submitted', 'Thank you for your valuable feedback!');
        if (onClose) onClose();
        return;
      }

      if (!bookingId) {
        throw new Error('bookingId is required');
      }

      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      else if (customerId) headers['x-customer-id'] = customerId;

      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(`${apiBaseUrl}/customer/bookings/${bookingId}/review`, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        Alert.alert(
          isEditMode ? 'Review Updated' : 'Review Submitted',
          data.message || 'Thank you for rating your service!'
        );
        if (onClose) onClose();
      } else {
        throw new Error(data.error || 'Could not submit review');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
      Alert.alert('Submission Error', err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const displayName = (eligibility?.worker?.name) || workerName;
  const displayService = (eligibility?.serviceTitle) || serviceName;

  const isEligible = eligibility ? eligibility.isEligible : true;
  const canSubmit = eligibility ? (isEditMode ? eligibility.canEdit : eligibility.canReview) : true;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7} accessibilityLabel="Close">
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Review & Rating' : 'Reviews & Ratings'}
          </Text>
          <View style={{ width: 42 }} />
        </View>

        {checkingEligibility ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Checking booking eligibility...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Ineligible or Closed Warning */}
            {eligibility && !isEligible && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>⚠️ Review Not Available</Text>
                <Text style={styles.warningDesc}>{eligibility.reason}</Text>
              </View>
            )}

            {eligibility && eligibility.alreadyReviewed && !eligibility.canEdit && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>🔒 Review Window Locked</Text>
                <Text style={styles.infoDesc}>
                  You already submitted a review for this booking. The 48-hour edit window has expired.
                </Text>
              </View>
            )}

            {/* Service & Worker Summary */}
            <View style={styles.workerSummaryCard}>
              <View style={styles.workerAvatar}>
                <Text style={styles.workerAvatarText}>
                  {displayName ? displayName.charAt(0) : 'P'}
                </Text>
              </View>
              <View style={styles.workerTextCol}>
                <Text style={styles.workerNameText}>{displayName}</Text>
                <Text style={styles.serviceNameText}>{displayService} Partner</Text>
              </View>
              {eligibility?.worker?.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>⭐ {eligibility.worker.rating}</Text>
                </View>
              )}
            </View>

            <Text style={styles.subtitle}>How was your overall experience?</Text>

            {/* 5-Star Interactive Rating Bar */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => canSubmit && setRating(star)}
                  activeOpacity={0.7}
                  disabled={!canSubmit}
                >
                  <Text style={[styles.starIcon, star <= rating ? styles.starFilled : styles.starEmpty]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Star Label */}
            <Text style={styles.starLabel}>
              {rating === 5 && '⭐⭐⭐⭐⭐ Excellent service'}
              {rating === 4 && '⭐⭐⭐⭐ Very good'}
              {rating === 3 && '⭐⭐⭐ Good, met expectations'}
              {rating === 2 && '⭐⭐ Fair, needs improvement'}
              {rating === 1 && '⭐ Poor experience'}
            </Text>

            {/* Compliment Badges */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>What stood out? (Tap badges)</Text>
              <View style={styles.badgesRow}>
                {complimentBadges.map((badge) => {
                  const active = selectedBadges.includes(badge);
                  return (
                    <TouchableOpacity
                      key={badge}
                      style={[styles.badgePill, active && styles.badgePillActive]}
                      onPress={() => canSubmit && toggleBadge(badge)}
                      activeOpacity={0.7}
                      disabled={!canSubmit}
                    >
                      <Text style={[styles.badgePillText, active && styles.badgePillTextActive]}>
                        {badge}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Worker Tip Selection */}
            <View style={styles.tipBox}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipTitle}>💵 Add a Tip for {displayName} (Optional)</Text>
                <Text style={styles.tipSub}>100% goes to partner</Text>
              </View>
              <View style={styles.tipOptionsRow}>
                {tipOptions.map((tipAmount) => {
                  const active = selectedTip === tipAmount;
                  return (
                    <TouchableOpacity
                      key={tipAmount}
                      style={[styles.tipBtn, active && styles.tipBtnActive]}
                      onPress={() => canSubmit && setSelectedTip(tipAmount)}
                      activeOpacity={0.7}
                      disabled={!canSubmit}
                    >
                      <Text style={[styles.tipBtnText, active && styles.tipBtnTextActive]}>
                        {tipAmount === 0 ? 'No Tip' : `₹${tipAmount}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Written Review Input */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Detailed Feedback (Optional)</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="e.g. Worker was punctual, cleaned up after work, and very polite!"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
                textAlignVertical="top"
                editable={canSubmit}
              />
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Submit Button */}
            {canSubmit ? (
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.88}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {isEditMode ? 'Update Review' : 'Submit Review & Rating'}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.submitBtn, styles.submitBtnDisabled]} disabled>
                <Text style={styles.submitBtnText}>Review Unavailable</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
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
    marginBottom: 16,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f294a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  workerSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workerAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  workerTextCol: {
    flex: 1,
  },
  workerNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  serviceNameText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 6,
  },
  starIcon: {
    fontSize: 42,
  },
  starFilled: {
    color: '#f59e0b',
  },
  starEmpty: {
    color: '#cbd5e1',
  },
  starLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 20,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  badgePillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  badgePillTextActive: {
    color: '#1d4ed8',
    fontWeight: '800',
  },
  tipBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    ...SHADOWS.small,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  tipSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  tipOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#86efac',
    alignItems: 'center',
  },
  tipBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  tipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  tipBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  reviewInput: {
    height: 90,
    fontSize: 14,
    color: '#0f294a',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#b91c1c',
    marginBottom: 4,
  },
  warningDesc: {
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369a1',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: '#0c4a6e',
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  submitBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
