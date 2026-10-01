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

export default function PhoneLoginScreen({
  initialPhone = '',
  onOtpSent,
  onBack,
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validate 10-digit Indian mobile number
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const isValidNumber = cleanPhone.length === 10;

  const handlePhoneChange = (val) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleGetOtp = async () => {
    if (!isValidNumber) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (loading) return; // Prevent duplicate requests
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await client.sendCustomerOtp(cleanPhone);
      if (response && response.success) {
        if (onOtpSent) {
          onOtpSent({
            phone: cleanPhone,
            devOtp: response.data?.devOtp || null,
            isSimulator: !!response.data?.isSimulator,
          });
        }
      } else {
        setErrorMessage(
          response?.error ||
          "We couldn't send the OTP. Please check your connection and try again."
        );
      }
    } catch (err) {
      setErrorMessage(
        "We couldn't send the OTP. Please check your connection and try again."
      );
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
            <Text style={styles.mainHeading}>Welcome to KaamDost</Text>
            <Text style={styles.supportingText}>
              Enter your mobile number to continue
            </Text>
          </View>

          {/* Glassmorphic Form Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Mobile Number</Text>

            <View
              style={[
                styles.inputWrapper,
                errorMessage ? styles.inputWrapperError : null,
              ]}
            >
              {/* +91 Country Code with Flag */}
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
                <View style={styles.codeDivider} />
              </View>

              {/* 10-Digit Mobile Input */}
              <TextInput
                style={styles.mobileInput}
                placeholder="Enter mobile number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChangeText={handlePhoneChange}
                onSubmitEditing={isValidNumber && !loading ? handleGetOtp : undefined}
                returnKeyType="done"
                autoFocus={true}
                accessibilityLabel="Enter 10-digit mobile number"
              />
            </View>

            {/* Error Message Display */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Security Guarantee Note */}
            <View style={styles.securityBox}>
              <Text style={styles.shieldIcon}>🔒</Text>
              <Text style={styles.securityText}>
                We will send a 6-digit OTP for secure verification. No password needed.
              </Text>
            </View>

            {/* Get OTP Button */}
            <TouchableOpacity
              style={[
                styles.getOtpBtn,
                !isValidNumber || loading ? styles.getOtpBtnDisabled : styles.getOtpBtnActive,
              ]}
              onPress={handleGetOtp}
              disabled={!isValidNumber || loading}
              activeOpacity={0.85}
              accessibilityLabel="Get OTP"
              accessibilityRole="button"
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.getOtpBtnText}>Loading...</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.getOtpBtnText,
                    !isValidNumber ? styles.getOtpBtnTextDisabled : null,
                  ]}
                >
                  Get OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Terms & Verification Assurance */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to KaamDost’s{' '}
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
    marginBottom: 20,
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
    marginBottom: 28,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f2c6e',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  supportingText: {
    fontSize: 15,
    color: '#5f7da6',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 320,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.md,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f2c6e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    overflow: 'hidden',
    height: 56,
    ...SHADOWS.xs,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 10,
    height: '100%',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  codeDivider: {
    width: 1.5,
    height: 24,
    backgroundColor: '#cbd5e1',
    marginLeft: 10,
  },
  mobileInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 17,
    fontWeight: '600',
    color: '#0f2c6e',
    letterSpacing: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 14,
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
  securityBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(239, 246, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  shieldIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  securityText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
  getOtpBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getOtpBtnActive: {
    backgroundColor: '#2563eb',
    ...SHADOWS.md,
  },
  getOtpBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  getOtpBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  getOtpBtnTextDisabled: {
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
