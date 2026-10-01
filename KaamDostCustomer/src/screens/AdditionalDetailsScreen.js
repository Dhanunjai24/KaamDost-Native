import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function AdditionalDetailsScreen({
  service,
  customerAddress,
  onBack,
  onOpenAddressPicker,
  onContinue,
}) {
  const [serviceType, setServiceType] = useState('Regular Cleaning');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const currentAddress = customerAddress || {
    label: 'Home',
    street: '123 Green Park, New Delhi',
  };

  const handleNext = () => {
    if (onContinue) {
      onContinue({
        serviceType,
        specialInstructions,
        address: currentAddress,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header matching screen_13 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Additional Details</Text>
            <View style={{ width: 42 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Section 1: Select Address Card matching screen_13 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Address</Text>
              <TouchableOpacity
                style={styles.addressCard}
                onPress={onOpenAddressPicker}
                activeOpacity={0.8}
              >
                <View style={styles.addressLeft}>
                  <View style={styles.addressIconBox}>
                    <Text style={styles.addressEmoji}>🏠</Text>
                  </View>
                  <View style={styles.addressTextCol}>
                    <Text style={styles.addressLabel}>{currentAddress.label || 'Home'}</Text>
                    <Text style={styles.addressStreet} numberOfLines={1}>
                      {currentAddress.street || '123 Green Park, New Delhi'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Section 2: Service Time / Type matching screen_13 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Service Time</Text>
              <View style={styles.toggleRow}>
                {['Regular Cleaning', 'Deep Cleaning'].map((type) => {
                  const isSelected = serviceType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.togglePill,
                        isSelected && styles.togglePillSelected,
                      ]}
                      onPress={() => setServiceType(type)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.toggleText,
                          isSelected && styles.toggleTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 3: Special Instructions matching screen_13 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Special Instructions</Text>
              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textarea}
                  placeholder="Enter any specific requests or instructions for the worker..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom CTA: "Continue" */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleNext}
              activeOpacity={0.88}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  addressEmoji: {
    fontSize: 20,
  },
  addressTextCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 2,
  },
  addressStreet: {
    fontSize: 13,
    color: '#5f7da6',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  togglePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    gap: 8,
    ...SHADOWS.sm,
  },
  togglePillSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    borderWidth: 1.5,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5f7da6',
  },
  toggleTextSelected: {
    color: '#2563eb',
    fontWeight: '800',
  },
  textareaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  textarea: {
    height: 90,
    fontSize: 14,
    color: '#0f2c6e',
    fontWeight: '500',
    lineHeight: 20,
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
