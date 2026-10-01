import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerAadhaarScreen({ onContinue, onBack }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('5482 9102 3847');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const checklistItems = [
    { id: 1, title: 'Aadhaar Number' },
    { id: 2, title: 'Document Verification' },
    { id: 3, title: 'Face Match' },
  ];

  const handleNext = () => {
    const raw = aadhaarNumber.replace(/\s/g, '');
    if (raw.length < 12) {
      setErrorMsg('Please enter valid 12-digit Aadhaar Number');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onContinue) {
        onContinue({
          maskedAadhaar: `XXXX-XXXX-${raw.slice(-4)}`,
          isAadhaarVerified: true,
        });
      }
    }, 700);
  };

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Top Back Navigation Arrow */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Aadhaar Verification</Text>
            <Text style={styles.subtitle}>Secure and safe verification</Text>
          </View>

          {/* Graphic Aadhaar Card Preview matching screen_06 */}
          <View style={styles.cardGraphic}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardChip} />
              <View style={styles.aadhaarBadge}>
                <Text style={styles.aadhaarSun}>☀️</Text>
                <Text style={styles.aadhaarBadgeText}>AADHAAR</Text>
              </View>
            </View>

            <View style={styles.cardBodyRow}>
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarEmoji}>👤</Text>
              </View>
              <View style={styles.cardLines}>
                <View style={styles.cardLineWide} />
                <View style={styles.cardLineMed} />
                <View style={styles.cardLineSmall} />
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.cardDigits}>{aadhaarNumber || 'XXXX XXXX XXXX'}</Text>
            </View>
          </View>

          {/* Aadhaar Input Field */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Enter 12-Digit Aadhaar Number</Text>
            <TextInput
              style={styles.aadhaarInput}
              placeholder="0000 0000 0000"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              maxLength={14}
              value={aadhaarNumber}
              onChangeText={(val) => {
                setAadhaarNumber(formatAadhaar(val));
                setErrorMsg('');
              }}
            />
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>

          {/* Verification Checklist matching screen_06 */}
          <View style={styles.checklistCard}>
            {checklistItems.map((item) => (
              <View key={item.id} style={styles.checkItem}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.checkText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.continueBtnText}>Continue</Text>
            )}
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
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f294a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  cardGraphic: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#fef08a',
    borderWidth: 1,
    borderColor: '#fde047',
  },
  aadhaarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffedd5',
    gap: 4,
  },
  aadhaarSun: {
    fontSize: 14,
  },
  aadhaarBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ea580c',
    letterSpacing: 0.8,
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  cardAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarEmoji: {
    fontSize: 26,
  },
  cardLines: {
    flex: 1,
    gap: 6,
  },
  cardLineWide: {
    height: 9,
    borderRadius: 5,
    backgroundColor: '#cbd5e1',
    width: '85%',
  },
  cardLineMed: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    width: '65%',
  },
  cardLineSmall: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
    width: '45%',
  },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  cardDigits: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f294a',
    letterSpacing: 3,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f294a',
    marginBottom: 8,
  },
  aadhaarInput: {
    backgroundColor: '#f8faff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
    letterSpacing: 2,
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    gap: 14,
    ...SHADOWS.small,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  checkMark: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  footer: {
    paddingTop: 12,
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
