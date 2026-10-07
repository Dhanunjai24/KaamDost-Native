import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerLoginScreen({ onLoginSuccess, onGoToRegister, onSwitchToCustomer }) {
  const [phone, setPhone] = useState('9848012345');
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
    if (phone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await api.sendWorkerOtp(phone);
      setOtpSent(true);
      setCountdown(30);
      setOtp('123456');
    } catch (e) {
      setErrorMsg(e.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter 6-digit OTP code');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.verifyWorkerOtp(phone, otp);
      if (res.isNewUser && onGoToRegister) {
        onGoToRegister({ phone });
      } else {
        onLoginSuccess(res.user || {
          id: 'w_101',
          name: 'Ramesh Reddy',
          phone,
          trade: 'masonry',
          tradeName: 'Mason',
          dailyRate: 950,
          city: 'Sangareddy',
          rating: 4.9,
          isVerified: true
        });
      }
    } catch (e) {
      setErrorMsg(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B1320' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
      <GlassBackground>
        <View style={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 2 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33.3%' }]} />
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>👷</Text>
            </View>
            <Text style={styles.brandTitle}>
              Kaam<Text style={{ color: '#FF6B00' }}>Dost</Text> Partner
            </Text>
            <Text style={styles.title}>Partner Mobile Login</Text>
            <Text style={styles.subtitle}>
              {otpSent ? `OTP sent to +91 ${phone}` : 'Login with your registered 10-digit mobile number'}
            </Text>
          </View>

          {/* Glass Input Card */}
          <GlassCard style={styles.card}>
            {!otpSent ? (
              <View>
                <Text style={styles.inputLabel}>Registered Mobile Number *</Text>
                <View style={styles.phoneInputRow}>
                  <Text style={styles.countryCode}>🇮🇳 +91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="9848012345"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <GlassButton
                  title={loading ? 'Sending OTP...' : 'Send OTP (ఓటీపీ పంపండి) →'}
                  onPress={handleSendOtp}
                  disabled={loading}
                  variant="primary"
                  size="large"
                  style={{ marginTop: 14 }}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.inputLabel}>Enter 6-Digit OTP *</Text>
                <TextInput
                  style={styles.otpInput}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="• • • • • •"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="numeric"
                  maxLength={6}
                />

                <View style={styles.resendRow}>
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={countdown > 0}
                  >
                    <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.changePhoneText}>Change number</Text>
                  </TouchableOpacity>
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <GlassButton
                  title={loading ? 'Verifying...' : 'Verify OTP & Login →'}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                  variant="primary"
                  size="large"
                  style={{ marginTop: 14 }}
                />
              </View>
            )}
          </GlassCard>

          {/* New Partner Registration CTA (Step 3) */}
          <TouchableOpacity
            style={styles.registerCta}
            onPress={() => onGoToRegister && onGoToRegister({ phone })}
          >
            <Text style={styles.registerText}>
              New Worker? <Text style={styles.registerHighlight}>Register as Partner (Step 3) →</Text>
            </Text>
          </TouchableOpacity>

          {/* Switch to Customer App */}
          {onSwitchToCustomer ? (
            <TouchableOpacity style={styles.switchRoleBtn} onPress={onSwitchToCustomer}>
              <Text style={styles.switchRoleText}>
                Need to hire labour? <Text style={styles.switchRoleHighlight}>Switch to Customer App 🛍️</Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, justifyContent: 'space-between', paddingBottom: 20 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#FF6B00', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FF6B00', borderRadius: 3 },
  header: { alignItems: 'center', marginBottom: 16 },
  logoBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 107, 0, 0.15)', borderWidth: 1.5, borderColor: 'rgba(255, 107, 0, 0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  logoEmoji: { fontSize: 28 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  title: { fontSize: 16, fontWeight: '700', color: '#FF8800', marginTop: 4 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'center' },
  card: { padding: 18, marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12
  },
  countryCode: { fontSize: 15, fontWeight: '700', color: '#FF8800', marginRight: 10 },
  phoneInput: { flex: 1, height: 50, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  otpInput: {
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center'
  },
  resendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  resendText: { fontSize: 12, fontWeight: '700', color: '#FF6B00' },
  resendDisabled: { color: 'rgba(255,255,255,0.4)' },
  changePhoneText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 8 },
  registerCta: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,0,0.3)',
    marginBottom: 8
  },
  registerText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  registerHighlight: { color: '#FF6B00', fontWeight: '700' },
  switchRoleBtn: { alignItems: 'center', paddingVertical: 10 },
  switchRoleText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  switchRoleHighlight: { color: '#00D1FF', fontWeight: '700' }
});
