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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
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

          {/* Overlapping Aadhaar Identity Card with official sun fingerprint logo pill */}
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
            <View style={[styles.inputBox, errorMsg ? styles.inputBoxError : null]}>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={14}
                value={aadhaarNumber}
                onChangeText={(text) => {
                  setAadhaarNumber(formatAadhaar(text));
                  if (errorMsg) setErrorMsg('');
                }}
              />
              <View style={styles.shieldPill}>
                <Text style={styles.shieldPillText}>UIDAI ✓</Text>
              </View>
            </View>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>

          {/* Verified Checklist Container with 3 green checkmarks */}
          <View style={styles.checklistCard}>
            <Text style={styles.checklistHeader}>Verification Steps</Text>
            {checklistItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.checkRow,
                  index < checklistItems.length - 1 && styles.checkRowBorder,
                ]}
              >
                <View style={styles.checkIconBox}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.checkTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* CTA: Full-width "Continue" gradient pill button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
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
    backgroundColor: '#f0f6ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f7da6',
    marginTop: 4,
    fontWeight: '500',
  },
  cardGraphic: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.md,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardChip: {
    width: 34,
    height: 26,
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
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffedd5',
    gap: 5,
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
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  cardAvatarEmoji: {
    fontSize: 24,
  },
  cardLines: {
    flex: 1,
    gap: 6,
  },
  cardLineWide: {
    height: 7,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    width: '75%',
  },
  cardLineMed: {
    height: 7,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    width: '55%',
  },
  cardLineSmall: {
    height: 7,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    width: '40%',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    alignItems: 'center',
  },
  cardDigits: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: 3,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f2c6e',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#dbeafe',
    paddingHorizontal: 14,
    height: 52,
  },
  inputBoxError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2c6e',
    letterSpacing: 1.5,
  },
  shieldPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shieldPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '600',
  },
  checklistCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
    marginBottom: 16,
  },
  checklistHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5f7da6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  checkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
  },
  checkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  checkMark: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16a34a',
  },
  checkTitle: {
    fontSize: 15,
    fontWeight: '700',
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
