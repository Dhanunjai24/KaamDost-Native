import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerLoginScreen({ onLoginSuccess, onGoToRegister, onSwitchToCustomer }) {
  const [phone, setPhone] = useState('9848012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setErrorMsg('Please enter 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('123456');
    }, 600);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter 6-digit OTP code');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
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
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <View style={styles.container}>
        {/* Brand Banner */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>
            Kaam<Text style={styles.brandAccent}>Dost</Text>
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>WORKER PARTNER PORTAL</Text>
          </View>
          <Text style={styles.subheading}>
            Earn government standard daily wages with zero platform commission
          </Text>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {otpSent ? 'Verify OTP Code' : 'Partner Mobile Login'}
          </Text>

          {!otpSent ? (
            <View>
              <Text style={styles.label}>Registered Partner Phone Number</Text>
              <View style={styles.inputRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefix}>+91</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="9848012345"
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

              <TouchableOpacity style={styles.submitBtn} onPress={handleSendOtp} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>Get OTP Code →</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Enter OTP (Dev OTP: 123456)</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="• • • • • •"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <TouchableOpacity style={styles.submitBtn} onPress={handleVerify} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>Verify & Login as Partner ✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.changePhoneBtn}>
                <Text style={styles.changePhoneText}>← Change Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* New partner onboarding link */}
          <TouchableOpacity onPress={onGoToRegister} style={styles.registerLink}>
            <Text style={styles.registerLinkText}>
              New to KaamDost? <Text style={styles.registerBold}>Register as a Worker Partner →</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Switch to customer app */}
        <TouchableOpacity onPress={onSwitchToCustomer} style={styles.switchAppBtn}>
          <Text style={styles.switchAppText}>
            Looking to hire workers? <Text style={styles.switchBold}>Go to Customer App</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary
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
    color: COLORS.textWhite,
    letterSpacing: -1
  },
  brandAccent: {
    color: COLORS.primary
  },
  badge: {
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 8
  },
  badgeText: {
    color: COLORS.primarySoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.large
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    marginBottom: 14
  },
  prefixBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.borderLight,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    justifyContent: 'center'
  },
  prefix: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 14
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  },
  changePhoneBtn: {
    alignItems: 'center',
    marginTop: 12
  },
  changePhoneText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  registerLink: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'center'
  },
  registerLinkText: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  registerBold: {
    fontWeight: '800',
    color: COLORS.primary
  },
  switchAppBtn: {
    alignItems: 'center',
    marginTop: 20
  },
  switchAppText: {
    fontSize: 12,
    color: COLORS.textMuted
  },
  switchBold: {
    color: COLORS.textWhite,
    fontWeight: '700'
  }
});
