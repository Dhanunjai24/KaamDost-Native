import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import client from '../../../shared/api/client';
import { setStoredSession } from '../../../shared/storage/storage';

export default function CustomerRegisterScreen({
  phone = '',
  registrationToken = null,
  onRegisterSuccess,
  onBack,
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Clean verified mobile number
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

  // Email format validation regex
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = EMAIL_RE.test(email.trim().toLowerCase());
  const isNameValid = fullName.trim().length > 0;
  const isFormValid = isNameValid && isEmailValid && cleanPhone.length === 10;

  const handleCreateAccount = async () => {
    // Front validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (loading) return; // Prevent duplicate rapid submission
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: fullName.trim(),
        name: fullName.trim(),
        phone: cleanPhone,
        mobileNumber: cleanPhone,
        email: email.trim().toLowerCase(),
        referralCode: referralCode.trim().toUpperCase(),
        registrationToken,
        phoneVerified: true,
      };

      const response = await client.registerCustomer(payload);

      if (response && response.success) {
        const sessionCustomer = {
          authenticated: true,
          customerId: response.data?.customerId || response.data?.id,
          id: response.data?.customerId || response.data?.id,
          fullName: response.data?.fullName || fullName.trim(),
          name: response.data?.fullName || fullName.trim(),
          mobileNumber: cleanPhone,
          phone: cleanPhone,
          email: response.data?.email || email.trim().toLowerCase(),
          referralCode: response.data?.referralCode || null,
          phoneVerified: true,
          role: 'customer',
        };

        const token = response.token || 'kaamdost_customer_session';

        // Persist session in storage
        await setStoredSession(sessionCustomer, token);

        if (onRegisterSuccess) {
          onRegisterSuccess({ customer: sessionCustomer, token });
        }
      } else {
        // Specific backend error messages
        setErrorMessage(
          response?.error || "We couldn't create your account. Please try again."
        );
      }
    } catch (err) {
      setErrorMessage("We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            {onBack ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <Text style={styles.backArrow}>‹</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 44 }} />
            )}

            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>KD</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Heading Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainHeading}>Create Your Account</Text>
            <Text style={styles.supportingText}>
              Complete your details to get started with KaamDost.
            </Text>
          </View>

          {/* Glassmorphic Form Card */}
          <View style={styles.card}>
            {/* 1. Full Name Input (Required) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus={true}
                  accessibilityLabel="Full Name input"
                />
              </View>
            </View>

            {/* 2. Mobile Number (Auto-populated, Read-Only, Non-Editable) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>Verified ✓</Text>
                </View>
              </View>
              <View style={[styles.inputWrapper, styles.inputWrapperReadOnly]}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                  <View style={styles.codeDivider} />
                </View>
                <TextInput
                  style={[styles.textInput, styles.textInputReadOnly]}
                  value={`+91 ${cleanPhone}`}
                  editable={false}
                  selectTextOnFocus={false}
                  accessibilityLabel="Verified Mobile Number (read-only)"
                />
              </View>
            </View>

            {/* 3. Email Address Input (Required) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email address"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  accessibilityLabel="Email Address input"
                />
              </View>
            </View>

            {/* 4. Referral Code (Optional) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Referral Code</Text>
                <Text style={styles.optionalTag}>(Optional)</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter referral code (optional)"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="characters"
                  value={referralCode}
                  onChangeText={(val) => {
                    setReferralCode(val.toUpperCase());
                    if (errorMessage) setErrorMessage('');
                  }}
                  accessibilityLabel="Referral Code optional input"
                />
              </View>
            </View>

            {/* Error Message Banner */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Create Account Primary Button */}
            <TouchableOpacity
              style={[
                styles.createAccountBtn,
                !isFormValid || loading
                  ? styles.createAccountBtnDisabled
                  : styles.createAccountBtnActive,
              ]}
              onPress={handleCreateAccount}
              disabled={!isFormValid || loading}
              activeOpacity={0.85}
              accessibilityLabel="Create Account"
              accessibilityRole="button"
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.createAccountBtnText}>Creating account...</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.createAccountBtnText,
                    !isFormValid ? styles.createAccountBtnTextDisabled : null,
                  ]}
                >
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Terms */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By creating an account, you agree to KaamDost’s{' '}
              <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 28,
    color: '#0f2c6e',
    fontWeight: '600',
    marginTop: -2,
    marginLeft: -2,
  },
  brandBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.sm,
  },
  brandBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  headerSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f2c6e',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  supportingText: {
    fontSize: 14,
    color: '#5f7da6',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: 320,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.md,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f2c6e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  optionalTag: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    overflow: 'hidden',
    height: 52,
    ...SHADOWS.xs,
  },
  inputWrapperReadOnly: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    height: '100%',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  codeDivider: {
    width: 1.5,
    height: 20,
    backgroundColor: '#e2e8f0',
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f2c6e',
  },
  textInputReadOnly: {
    color: '#64748b',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#b91c1c',
    fontWeight: '600',
    flex: 1,
  },
  createAccountBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  createAccountBtnActive: {
    backgroundColor: '#2563eb',
    ...SHADOWS.md,
  },
  createAccountBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  createAccountBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  createAccountBtnTextDisabled: {
    color: '#64748b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
