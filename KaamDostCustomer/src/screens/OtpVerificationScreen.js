import React, { useState, useEffect, useRef } from 'react';
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

export default function OtpVerificationScreen({
  phone,
  devOtp: initialDevOtp = null,
  onVerifySuccess,
  onChangeMobile,
  onBack,
}) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(30);
  const [devOtp, setDevOtp] = useState(initialDevOtp);

  const inputRefs = useRef([]);

  // Mask mobile number: "+91 98XXXXXX21"
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
  const maskedPhone =
    cleanPhone.length === 10
      ? `+91 ${cleanPhone.slice(0, 2)}XXXXXX${cleanPhone.slice(-2)}`
      : `+91 ${phone}`;

  // 30s Cooldown Timer for Resend OTP
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  // Handle single digit change & auto-advance & paste
  const handleDigitChange = (val, index) => {
    const clean = val.replace(/\D/g, '');

    // Handle complete 6-digit paste
    if (clean.length === 6) {
      const newDigits = clean.split('');
      setOtpDigits(newDigits);
      if (errorMessage) setErrorMessage('');
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
      return;
    }

    const digit = clean.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (errorMessage) {
      setErrorMessage('');
    }

    // Auto-advance focus
    if (digit && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const isOtpComplete = otpDigits.every((d) => d.length === 1);
  const fullOtp = otpDigits.join('');

  // Backend Verification
  const handleVerify = async () => {
    if (!isOtpComplete || loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await client.verifyCustomerOtp(cleanPhone, fullOtp);

      if (response && response.success) {
        if (response.isNewCustomer) {
          // NEW CUSTOMER: Proceed to Step 3 Registration Screen
          if (onVerifySuccess) {
            onVerifySuccess({
              isNewCustomer: true,
              phone: cleanPhone,
              registrationToken: response.registrationToken || null,
            });
          }
        } else {
          // EXISTING CUSTOMER: Skip Registration Form, create/restore session immediately
          const sessionCustomer = {
            authenticated: true,
            customerId: response.data?.customerId || response.data?.id || `c_${cleanPhone}`,
            id: response.data?.customerId || response.data?.id || `c_${cleanPhone}`,
            mobileNumber: cleanPhone,
            phone: cleanPhone,
            phoneVerified: true,
            isNewCustomer: false,
            role: 'customer',
            name: response.data?.fullName || response.data?.name || null,
            fullName: response.data?.fullName || response.data?.name || null,
            email: response.data?.email || null,
          };

          const token = response.token || 'kaamdost_customer_session';

          // Persist session in storage
          await setStoredSession(sessionCustomer, token);

          if (onVerifySuccess) {
            onVerifySuccess({
              isNewCustomer: false,
              customer: sessionCustomer,
              token,
            });
          }
        }
      } else {
        // Specific error messages as per requirements
        if (response?.expired) {
          setErrorMessage('This OTP has expired. Please request a new OTP.');
        } else if (response?.error?.includes('Too many attempts')) {
          setErrorMessage('Too many attempts. Please wait a moment and try again.');
        } else {
          setErrorMessage(
            response?.error || 'Incorrect OTP. Please check the code and try again.'
          );
        }
      }
    } catch (err) {
      setErrorMessage("We couldn't verify the OTP. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setErrorMessage('');

    try {
      const response = await client.sendCustomerOtp(cleanPhone);
      if (response && response.success) {
        setCooldown(30); // Reset timer to 30s
        setOtpDigits(['', '', '', '', '', '']); // Clear fields
        if (response.data?.devOtp) {
          setDevOtp(response.data.devOtp);
        }
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setErrorMessage(
          response?.error ||
          "We couldn't send the OTP. Please check your connection and try again."
        );
      }
    } catch (err) {
      setErrorMessage("We couldn't send the OTP. Please check your connection and try again.");
    } finally {
      setResending(false);
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack || onChangeMobile}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>

            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>KD</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Heading Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainHeading}>Verify your mobile number</Text>
            <Text style={styles.supportingText}>
              Enter the 6-digit OTP sent to{'\n'}
              <Text style={styles.maskedPhoneText}>{maskedPhone}</Text>
            </Text>
          </View>

          {/* Dev Simulator Indicator (Only shown in local development) */}
          {devOtp ? (
            <View style={styles.devBanner}>
              <Text style={styles.devBannerText}>
                🛠️ <Text style={{ fontWeight: '700' }}>Dev Simulator OTP:</Text> {devOtp}{' '}
                <Text style={styles.devModeTag}>(Development Mode Only)</Text>
              </Text>
            </View>
          ) : null}

          {/* Glassmorphic Form Card */}
          <View style={styles.card}>
            {/* 6 Digit Input Boxes */}
            <View style={styles.otpGrid}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                    errorMessage ? styles.otpBoxError : null,
                  ]}
                  value={digit}
                  onChangeText={(val) => handleDigitChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={index === 0 ? 6 : 1}
                  selectTextOnFocus={true}
                  autoFocus={index === 0}
                  accessibilityLabel={`Digit ${index + 1} of 6`}
                />
              ))}
            </View>

            {/* Error Message Display */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Verify & Continue Button */}
            <TouchableOpacity
              style={[
                styles.verifyBtn,
                !isOtpComplete || loading ? styles.verifyBtnDisabled : styles.verifyBtnActive,
              ]}
              onPress={handleVerify}
              disabled={!isOtpComplete || loading}
              activeOpacity={0.85}
              accessibilityLabel="Verify and continue"
              accessibilityRole="button"
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.verifyBtnText}>Verifying...</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.verifyBtnText,
                    !isOtpComplete ? styles.verifyBtnTextDisabled : null,
                  ]}
                >
                  Verify & Continue
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendPrompt}>Didn’t receive the OTP?</Text>

              {cooldown > 0 ? (
                <View style={styles.cooldownBadge}>
                  <Text style={styles.cooldownText}>Resend OTP in {cooldown}s</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.resendActiveText}>
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Change Mobile Number Link */}
            <TouchableOpacity
              style={styles.changeMobileBtn}
              onPress={onChangeMobile}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.changeMobileText}>Change mobile number</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Assistance */}
          <View style={styles.footer}>
            <Text style={styles.footerHelpText}>
              Need help? KaamDost 24/7 Support will assist you.
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
    marginBottom: 24,
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
  },
  maskedPhoneText: {
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: 0.5,
  },
  devBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginBottom: 20,
  },
  devBannerText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  devModeTag: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
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
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 44,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#0f2c6e',
    ...SHADOWS.xs,
  },
  otpBoxFilled: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  otpBoxError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
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
  verifyBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verifyBtnActive: {
    backgroundColor: '#2563eb',
    ...SHADOWS.md,
  },
  verifyBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  verifyBtnTextDisabled: {
    color: '#64748b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendPrompt: {
    fontSize: 13,
    color: '#5f7da6',
    fontWeight: '500',
    marginBottom: 6,
  },
  cooldownBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  cooldownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  resendActiveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  changeMobileBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  changeMobileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5f7da6',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerHelpText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
