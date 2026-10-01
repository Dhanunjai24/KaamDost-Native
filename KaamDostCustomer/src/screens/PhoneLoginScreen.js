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

export default function PhoneLoginScreen({
  onLoginSuccess,
  onGoToRegister,
  onSwitchRole,
  onBack,
}) {
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('123456'); // Dev pre-fill for ease
    }, 600);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter 6-digit verification OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          id: 'cust_101',
          name: 'Rahul Sharma',
          phone,
          address: {
            city: 'New Delhi',
            street: '123 Green Park',
            pincode: '110016',
          },
        });
      }
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Top Back Navigation Arrow */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack || (() => setOtpSent(false))}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          {/* Heading Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {otpSent ? `Enter the 6-digit code sent to +91 ${phone}` : 'Login with your mobile number'}
            </Text>
          </View>

          {/* Mobile Input Card */}
          <View style={styles.card}>
            {!otpSent ? (
              <View>
                <View style={styles.inputContainer}>
                  <View style={styles.flagBox}>
                    <Text style={styles.flag}>🇮🇳</Text>
                    <Text style={styles.dialCode}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="98765 43210"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val.replace(/\D/g, ''));
                      setErrorMsg('');
                    }}
                  />
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                {/* Primary Button */}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSendOtp}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Send OTP</Text>
                  )}
                </TouchableOpacity>

                {/* Secondary Option */}
                <TouchableOpacity
                  style={styles.secondaryOptionBtn}
                  onPress={() => setOtpSent(true)}
                >
                  <Text style={styles.secondaryOptionText}>Login with Password</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.otpLabel}>Enter OTP Code</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="• • • • • •"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(val) => {
                    setOtp(val.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                />

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleVerify}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Verify & Continue ✓</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changeNumberBtn}
                  onPress={() => setOtpSent(false)}
                >
                  <Text style={styles.changeNumberText}>← Change Mobile Number</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Link to Registration */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Don't have an account? </Text>
              <TouchableOpacity onPress={onGoToRegister}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Illustration Graphic matching screen_02 */}
          <View style={styles.illustrationCard}>
            <View style={styles.mockupPhone}>
              <View style={styles.phoneScreen}>
                <Text style={styles.phoneScreenEmoji}>📱 👷</Text>
                <Text style={styles.phoneScreenText}>Instant Verified Help</Text>
              </View>
            </View>
            <View style={styles.characterBadge}>
              <Text style={styles.characterEmoji}>👨‍🔧</Text>
            </View>
          </View>

          {/* Switch to Partner Role */}
          {onSwitchRole && (
            <TouchableOpacity onPress={onSwitchRole} style={styles.switchRoleBtn}>
              <Text style={styles.switchRoleText}>
                Are you a Worker / Provider? <Text style={styles.switchRoleBold}>Go to Partner App →</Text>
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
    minHeight: '100%',
    justifyContent: 'space-between',
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
  header: {
    marginBottom: 26,
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: '#e0edfd',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#dbeafe',
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  dialCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f294a',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f294a',
    marginBottom: 8,
  },
  otpInput: {
    backgroundColor: '#f8faff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '800',
    color: '#1d4ed8',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryOptionBtn: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 6,
  },
  secondaryOptionText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  },
  changeNumberBtn: {
    alignItems: 'center',
    marginTop: 12,
  },
  changeNumberText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  registerPrompt: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563eb',
  },
  illustrationCard: {
    backgroundColor: 'rgba(219, 234, 254, 0.45)',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 16,
  },
  mockupPhone: {
    width: 90,
    height: 110,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#93c5fd',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  phoneScreen: {
    alignItems: 'center',
  },
  phoneScreenEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  phoneScreenText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1d4ed8',
    textAlign: 'center',
  },
  characterBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 34,
  },
  switchRoleBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
  },
  switchRoleText: {
    fontSize: 13,
    color: '#64748b',
  },
  switchRoleBold: {
    fontWeight: '700',
    color: '#2563eb',
  },
});
