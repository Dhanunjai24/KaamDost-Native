import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import { t } from '../../../shared/i18n';
import api from '../../../shared/api/client';

export default function PhoneLoginScreen({ onLoginSuccess, onSwitchRole }) {
  const { theme, shadows } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
              Kaam<Text style={{ color: theme.accentPrimary }}>Dost</Text>
            </Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {t('loginTitle')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {otpSent
                ? `${t('enterOtpPrompt')} +91 ${phone}`
                : t('loginSubtitle')}
            </Text>
          </View>

          {/* Frosted Glass Input Card */}
          <GlassCard style={styles.card} variant="strong">
            {!otpSent ? (
              <View>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                  Mobile Number
                </Text>
                <View
                  style={[
                    styles.phoneInputRow,
                    {
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.prefixBox,
                      {
                        backgroundColor: theme.primaryLight,
                        borderRightColor: theme.border
                      }
                    ]}
                  >
                    <Text style={styles.flag}>🇮🇳</Text>
                    <Text style={[styles.prefix, { color: theme.textPrimary }]}>+91</Text>
                  </View>
                  <TextInput
                    style={[styles.phoneInput, { color: theme.textPrimary }]}
                    placeholder={t('mobilePlaceholder')}
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(val) => {
                      setPhone(val.replace(/\D/g, ''));
                      setErrorMsg('');
                    }}
                  />
                </View>

                {errorMsg ? (
                  <Text style={[styles.errorText, { color: theme.danger }]}>{errorMsg}</Text>
                ) : null}

                <GlassButton
                  title={`${t('getOtp')} →`}
                  onPress={handleSendOtp}
                  loading={loading}
                  variant="primary"
                  size="md"
                  style={{ marginTop: 8 }}
                />
              </View>
            ) : (
              <View>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                  Enter 6-Digit OTP
                </Text>
                <TextInput
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: theme.glassSurface,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }
                  ]}
                  placeholder="• • • • • •"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(val) => {
                    setOtp(val.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                />

                <View style={styles.otpHelperRow}>
                  <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                    Dev OTP: 123456
                  </Text>
                  {countdown > 0 ? (
                    <Text style={[styles.timerText, { color: theme.textSecondary }]}>
                      Resend in {countdown}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text style={[styles.resendLink, { color: theme.accentPrimary }]}>
                        {t('resendOtp')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {errorMsg ? (
                  <Text style={[styles.errorText, { color: theme.danger }]}>{errorMsg}</Text>
                ) : null}

                <GlassButton
                  title={`${t('verifyOtp')} ✓`}
                  onPress={handleVerifyOtp}
                  loading={loading}
                  variant="primary"
                  size="md"
                  style={{ marginTop: 10 }}
                />

                <TouchableOpacity
                  style={styles.changeNumberBtn}
                  onPress={() => setOtpSent(false)}
                >
                  <Text style={[styles.changeNumberText, { color: theme.textSecondary }]}>
                    ← Change Mobile Number
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>

          {/* Worker role switcher */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onSwitchRole} style={styles.switchRoleBtn}>
              <Text style={[styles.switchRoleText, { color: theme.textSecondary }]}>
                Are you a Worker / Dost Partner?{' '}
                <Text style={[styles.switchRoleBold, { color: theme.accentPrimary }]}>
                  Go to Partner App →
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
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
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 6
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20
  },
  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.2
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1
  },
  flag: {
    fontSize: 14,
    marginRight: 6
  },
  prefix: {
    fontSize: 14,
    fontWeight: '800'
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1
  },
  otpInput: {
    borderWidth: 1.2,
    borderRadius: 14,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 10
  },
  otpHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  helperText: {
    fontSize: 11
  },
  timerText: {
    fontSize: 11
  },
  resendLink: {
    fontSize: 12,
    fontWeight: '800'
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  changeNumberBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4
  },
  changeNumberText: {
    fontSize: 12,
    fontWeight: '600'
  },
  footer: {
    alignItems: 'center',
    marginTop: 24
  },
  switchRoleBtn: {
    padding: 10
  },
  switchRoleText: {
    fontSize: 12
  },
  switchRoleBold: {
    fontWeight: '800'
  }
});
