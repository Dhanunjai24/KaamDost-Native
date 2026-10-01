import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function RatingTipModal({ visible, workerName = 'Ramesh Reddy', onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(50);
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Skilled Work']);
  const [feedback, setFeedback] = useState('');

  const tags = ['Punctual', 'Skilled Work', 'Polite', 'Cleaned up', 'Fair Pricing'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      rating,
      tip,
      tags: selectedTags,
      feedback
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Rate Your Dost</Text>
            <Text style={styles.subtitle}>How was your experience with {workerName}?</Text>
          </View>

          {/* Star selector */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.starIcon, star <= rating ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick compliment tags */}
          <View style={styles.tagsContainer}>
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, active && styles.tagActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Add a tip */}
          <View style={styles.tipSection}>
            <Text style={styles.tipLabel}>Add a tip for great work?</Text>
            <View style={styles.tipRow}>
              {[0, 30, 50, 100].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.tipBtn, tip === amount && styles.tipBtnActive]}
                  onPress={() => setTip(amount)}
                >
                  <Text style={[styles.tipBtnText, tip === amount && styles.tipBtnTextActive]}>
                    {amount === 0 ? 'No Tip' : `₹${amount}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Written feedback */}
          <TextInput
            style={styles.input}
            placeholder="Write a message of appreciation (optional)..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={2}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Review & Tip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14
  },
  header: {
    alignItems: 'center',
    marginBottom: 14
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16
  },
  starIcon: {
    fontSize: 34
  },
  starFilled: {
    color: '#f59e0b'
  },
  starEmpty: {
    color: COLORS.border
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  tagActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  tagTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  tipSection: {
    marginBottom: 14
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center'
  },
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  tipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  tipBtnActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight
  },
  tipBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  tipBtnTextActive: {
    color: COLORS.accent,
    fontWeight: '700'
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginBottom: 16
  },
  footer: {},
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.small
  },
  submitText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  }
});
