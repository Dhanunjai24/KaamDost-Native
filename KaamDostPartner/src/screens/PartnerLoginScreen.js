import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerLoginScreen({ lang = 'te', onLoginSuccess, onGoToRegister, onSwitchToCustomer }) {
  const isTe = lang === 'te';
  const [phone, setPhone] = useState('');
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
      setErrorMsg(isTe ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit Indian mobile number');
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
      setErrorMsg(e.message || (isTe ? 'ఓటీపీ పంపడంలో లోపం జరిగింది' : 'Error sending OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMsg(isTe ? 'దయచేసి 6 అంకెల ఓటీపీని నమోదు చేయండి' : 'Please enter 6-digit OTP code');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.verifyWorkerOtp(phone, otp);
      const isRegistered = !res?.isNewUser && !res?.isNewWorker && res?.user && res?.user?.registered !== false && (res?.user?.trade || res?.user?.tradeName);

      if (!isRegistered && onGoToRegister) {
        onGoToRegister({ phone, ...(res?.data || {}) });
      } else if (isRegistered && onLoginSuccess) {
        onLoginSuccess(res.user || res.data);
      } else if (onGoToRegister) {
        onGoToRegister({ phone });
      }
    } catch (e) {
      setErrorMsg(e.message || (isTe ? 'ఓటీపీ ధృవీకరణ విఫలమైంది' : 'Verification failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F4F8FC' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
      <GlassBackground>
        <View style={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>{isTe ? 'దశ 2 / 6' : 'Step 2 of 6'}</Text>
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
              Kaam<Text style={{ color: '#173F6B' }}>Dost</Text> {isTe ? 'పార్ట్‌నర్' : 'Partner'}
            </Text>
            <Text style={styles.title}>{isTe ? 'పార్ట్‌నర్ మొబైల్ లాగిన్' : 'Partner Mobile Login'}</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? (isTe ? `+91 ${phone} కు ఓటీపీ పంపబడింది` : `OTP sent to +91 ${phone}`)
                : (isTe ? 'మీ 10 అంకెల మొబైల్ నంబర్‌తో లాగిన్ అవ్వండి' : 'Login with your registered 10-digit mobile number')}
            </Text>
          </View>

          {/* Glass Input Card */}
          <GlassCard style={styles.card}>
            {!otpSent ? (
              <View>
                <Text style={styles.inputLabel}>{isTe ? 'నమోదిత మొబైల్ నంబర్ *' : 'Registered Mobile Number *'}</Text>
                <View style={styles.phoneInputRow}>
                  <Text style={styles.countryCode}>🇮🇳 +91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder={isTe ? '10 అంకెల నంబర్' : 'Enter 10-digit number'}
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <GlassButton
                  title={loading ? (isTe ? 'ఓటీపీ పంపుతోంది...' : 'Sending OTP...') : (isTe ? 'ఓటీపీ పంపండి →' : 'Send OTP →')}
                  onPress={handleSendOtp}
                  disabled={loading}
                  variant="primary"
                  size="large"
                  style={{ marginTop: 14 }}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.inputLabel}>{isTe ? '6 అంకెల ఓటీపీని నమోదు చేయండి *' : 'Enter 6-Digit OTP *'}</Text>
                <TextInput
                  style={styles.otpInput}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="• • • • • •"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={6}
                />

                <View style={styles.resendRow}>
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={countdown > 0}
                  >
                    <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
                      {countdown > 0
                        ? (isTe ? `${countdown}సె లో ఓటీపీ మళ్లీ పంపబడుతుంది` : `Resend OTP in ${countdown}s`)
                        : (isTe ? 'ఓటీపీ మళ్లీ పంపండి' : 'Resend OTP')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.changePhoneText}>{isTe ? 'నంబర్ మార్చండి' : 'Change number'}</Text>
                  </TouchableOpacity>
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <GlassButton
                  title={loading ? (isTe ? 'ధృవీకరిస్తోంది...' : 'Verifying...') : (isTe ? 'ఓటీపీని ధృవీకరించి లాగిన్ అవ్వండి →' : 'Verify OTP & Login →')}
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
              {isTe ? 'కొత్త వర్కరా? ' : 'New Worker? '}
              <Text style={styles.registerHighlight}>
                {isTe ? 'పార్ట్‌నర్‌గా నమోదు చేసుకోండి (దశ 3) →' : 'Register as Partner (Step 3) →'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Switch to Customer App */}
          {onSwitchToCustomer ? (
            <TouchableOpacity style={styles.switchRoleBtn} onPress={onSwitchToCustomer}>
              <Text style={styles.switchRoleText}>
                {isTe ? 'కూలీలు లేదా పనివారు కావాలా? ' : 'Need to hire labour? '}
                <Text style={styles.switchRoleHighlight}>
                  {isTe ? 'కస్టమర్ యాప్‌కి మారండి 🛍️' : 'Switch to Customer App 🛍️'}
                </Text>
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
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#173F6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(11, 35, 65, 0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0B2341', borderRadius: 3 },
  header: { alignItems: 'center', marginBottom: 16 },
  logoBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(23, 63, 107, 0.12)', borderWidth: 1.5, borderColor: 'rgba(23, 63, 107, 0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  logoEmoji: { fontSize: 28 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#0B2341', letterSpacing: 0.5 },
  title: { fontSize: 16, fontWeight: '700', color: '#173F6B', marginTop: 4 },
  subtitle: { fontSize: 12, color: '#48627D', marginTop: 4, textAlign: 'center' },
  card: { padding: 18, marginBottom: 12 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#0B2341', marginBottom: 8 },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 12
  },
  countryCode: { fontSize: 15, fontWeight: '700', color: '#0B2341', marginRight: 10 },
  phoneInput: { flex: 1, height: 50, color: '#0B2341', fontSize: 16, fontWeight: '600' },
  otpInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.18)',
    borderRadius: 12,
    color: '#0B2341',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center'
  },
  resendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  resendText: { fontSize: 12, fontWeight: '700', color: '#173F6B' },
  resendDisabled: { color: '#94A3B8' },
  changePhoneText: { fontSize: 12, color: '#48627D' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 8 },
  registerCta: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(23, 63, 107, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(23, 63, 107, 0.2)',
    marginBottom: 8
  },
  registerText: { fontSize: 13, color: '#48627D' },
  registerHighlight: { color: '#0B2341', fontWeight: '700' },
  switchRoleBtn: { alignItems: 'center', paddingVertical: 10 },
  switchRoleText: { fontSize: 12, color: '#6C86A3' },
  switchRoleHighlight: { color: '#173F6B', fontWeight: '700' }
});
