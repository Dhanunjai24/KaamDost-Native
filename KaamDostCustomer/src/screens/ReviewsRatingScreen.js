import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ReviewsRatingScreen({
  workerName = 'Rohit Kumar',
  onClose,
  onSubmitReview,
}) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    Alert.alert('Review Submitted', 'Thank you for your valuable feedback!');
    if (onSubmitReview) {
      onSubmitReview({ rating, review: reviewText });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_24 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reviews & Ratings</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>How was your service with {workerName}?</Text>

          {/* 5-Star Interactive Rating Bar matching screen_24 */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.starIcon,
                    star <= rating ? styles.starFilled : styles.starEmpty,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Optional Review Text Input matching screen_24 */}
          <View style={styles.reviewCard}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Add a review (optional)"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Review CTA matching screen_24 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.88}
          >
            <Text style={styles.submitBtnText}>Submit Review</Text>
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
    marginBottom: 20,
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
  content: {
    alignItems: 'center',
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  starIcon: {
    fontSize: 44,
  },
  starFilled: {
    color: '#2563eb',
  },
  starEmpty: {
    color: '#cbd5e1',
  },
  reviewCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    padding: 16,
    minHeight: 140,
    ...SHADOWS.small,
  },
  reviewInput: {
    fontSize: 15,
    color: '#0f294a',
    fontWeight: '500',
    lineHeight: 22,
  },
  footer: {
    paddingTop: 10,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
