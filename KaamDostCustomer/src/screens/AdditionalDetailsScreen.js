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
  const [serviceType, setServiceType] = useState('Deep Cleaning');
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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
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
                      {isSelected && (
                        <View style={styles.selectedDot}>
                          <View style={styles.selectedDotInner} />
                        </View>
                      )}
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
              <View style={styles.instructionsBox}>
                <TextInput
                  style={styles.instructionsInput}
                  placeholder="Eg. Keep products, Documents."
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

          {/* Bottom Continue Button matching screen_13 */}
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
    backgroundColor: '#f0f7ff',
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
    marginBottom: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  addressIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressEmoji: {
    fontSize: 20,
  },
  addressTextCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  addressStreet: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    gap: 6,
    ...SHADOWS.small,
  },
  togglePillSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  selectedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  toggleTextSelected: {
    color: '#2563eb',
    fontWeight: '800',
  },
  instructionsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    padding: 14,
    minHeight: 110,
    ...SHADOWS.small,
  },
  instructionsInput: {
    fontSize: 14,
    color: '#0f294a',
    fontWeight: '500',
    lineHeight: 20,
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
