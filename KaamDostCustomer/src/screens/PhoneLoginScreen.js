import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';
import api from '../../../shared/api/client';

export default function PhoneLoginScreen({ onLoginSuccess, onSwitchRole }) {
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setErrorMsg(t('invalidMobile'));
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await api.sendCustomerOtp(phone);
      setOtpSent(true);
      setCountdown(30);
      setOtp('123456'); // Auto-fill development OTP for convenient testing
    } catch (e) {
      setErrorMsg(e.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMsg(t('invalidOtp'));
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.verifyCustomerOtp(phone, otp);
      onLoginSuccess(res.user || res.customer || { phone, id: 'cust_101' });
    } catch (e) {
      setErrorMsg(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>
            Kaam<Text style={styles.brandAccent}>Dost</Text>
          </Text>
          <Text style={styles.title}>{t('loginTitle')}</Text>
          <Text style={styles.subtitle}>
            {otpSent
              ? `${t('enterOtpPrompt')} +91 ${phone}`
              : t('loginSubtitle')}
          </Text>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          {!otpSent ? (
            <View>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={styles.prefix}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder={t('mobilePlaceholder')}
                  placeholderTextColor={COLORS.textMuted}
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

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>{t('getOtp')} →</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="• • • • • •"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(val) => {
                  setOtp(val.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
              />

              <View style={styles.otpHelperRow}>
                <Text style={styles.helperText}>Dev OTP: 123456</Text>
                {countdown > 0 ? (
                  <Text style={styles.timerText}>Resend in {countdown}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOtp}>
                    <Text style={styles.resendLink}>{t('resendOtp')}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleVerifyOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>{t('verifyOtp')} ✓</Text>
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
        </View>

        {/* Worker role switcher */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={onSwitchRole} style={styles.switchRoleBtn}>
            <Text style={styles.switchRoleText}>
              Are you a Worker / Dost Partner? <Text style={styles.switchRoleBold}>Go to Partner App →</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -1,
    marginBottom: 6
  },
  brandAccent: {
    color: COLORS.primary
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 8
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    marginBottom: 14
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    backgroundColor: COLORS.borderLight
  },
  flag: {
    fontSize: 14,
    marginRight: 4
  },
  prefix: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 10
  },
  otpHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  helperText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600'
  },
  timerText: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  resendLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800'
  },
  changeNumberBtn: {
    marginTop: 14,
    alignItems: 'center'
  },
  changeNumberText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  footer: {
    marginTop: 24,
    alignItems: 'center'
  },
  switchRoleBtn: {
    padding: 8
  },
  switchRoleText: {
    fontSize: 13,
    color: COLORS.textSecondary
  },
  switchRoleBold: {
    fontWeight: '700',
    color: COLORS.primary
  }
});
