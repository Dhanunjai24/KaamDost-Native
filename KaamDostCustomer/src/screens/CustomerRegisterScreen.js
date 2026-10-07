import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function CustomerRegisterScreen({ phone = '9876543210', onContinue }) {
  const [fullName, setFullName] = useState('Ravi Kumar');
  const [email, setEmail] = useState('ravi.kumar@example.com');
  const [referralCode, setReferralCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    setErrorMsg('');
    onContinue({
      name: fullName.trim(),
      email: email.trim(),
      referralCode: referralCode.trim(),
      phone
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Stepper Header */}
        <View style={styles.stepperRow}>
          <Text style={styles.stepText}>Step 3 of 6</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{t('createAccount')}</Text>
          <Text style={styles.subtitle}>Complete your profile to unlock instant booking across Telangana</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.verifiedRow}>
            <Text style={styles.verifiedText}>Verified Mobile: +91 {phone}</Text>
            <Text style={styles.verifiedBadge}>Verified ✓</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('fullName')} *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ravi Kumar"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('email')} (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ravi@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Referral Code (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter friend's referral code"
              autoCapitalize="characters"
              value={referralCode}
              onChangeText={setReferralCode}
            />
            <Text style={styles.referralHint}>🎁 Earn ₹100 wallet credit upon first completed job</Text>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
            <Text style={styles.submitBtnText}>{t('continue')} →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    padding: 20
  },
  stepperRow: {
    marginBottom: 16
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  verifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent
  },
  field: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  referralHint: {
    fontSize: 11,
    color: COLORS.accent,
    marginTop: 4,
    fontWeight: '600'
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800'
  }
});
