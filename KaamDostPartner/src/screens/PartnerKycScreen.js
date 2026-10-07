import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerKycScreen({ partnerData, onKycApproved }) {
  const [aadhaar, setAadhaar] = useState('892145671234');
  const [eshramUan, setEshramUan] = useState('100984829104');
  const [bankAcc, setBankAcc] = useState('501004829104');
  const [ifsc, setIfsc] = useState('SBIN0001245');
  const [upiId, setUpiId] = useState('ramesh.reddy@sbi');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitKyc = () => {
    if (aadhaar.replace(/\D/g, '').length !== 12) {
      setErrorMsg('Aadhaar number must be 12 digits');
      return;
    }
    if (!bankAcc || !ifsc) {
      setErrorMsg('Please enter Bank account number and IFSC code');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onKycApproved({
        ...partnerData,
        isVerified: true,
        aadhaarMasked: 'XXXX-XXXX-' + aadhaar.slice(-4),
        bankAccount: bankAcc,
        ifsc,
        upiId
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Partner KYC & Payout Setup</Text>
          <Text style={styles.subtitle}>
            Aadhaar verification & direct bank link ensures zero-commission instant daily wage payouts
          </Text>
        </View>

        {/* 1. Aadhaar Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Aadhaar Identity</Text>
          <Text style={styles.label}>12-Digit Aadhaar Number *</Text>
          <TextInput
            style={styles.input}
            value={aadhaar}
            onChangeText={setAadhaar}
            keyboardType="number-pad"
            maxLength={12}
          />
          <View style={styles.verifiedRow}>
            <Text style={styles.verifiedIcon}>🛡️</Text>
            <Text style={styles.verifiedNote}>Aadhaar photo biometric will be matched with selfie</Text>
          </View>
        </View>

        {/* 2. Government e-Shram & Labour Welfare Link */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>2. e-Shram Welfare Link</Text>
            <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
              <Text style={{ color: '#16a34a', fontWeight: '800', fontSize: 11 }}>GOVT VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.label}>12-Digit e-Shram Universal Account No (UAN)</Text>
          <TextInput
            style={styles.input}
            value={eshramUan}
            onChangeText={setEshramUan}
            keyboardType="number-pad"
            maxLength={12}
            placeholder="e.g. 100984829104"
          />
          <View style={styles.verifiedRow}>
            <Text style={styles.verifiedIcon}>🏛️</Text>
            <Text style={styles.verifiedNote}>
              Links Pradhan Mantri Suraksha Bima Yojana (PMSBY) ₹2 Lakh accidental insurance & Telangana BOCW welfare.
            </Text>
          </View>
        </View>

        {/* 3. Bank Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Bank Account (For Instant Wages)</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Account Number *</Text>
            <TextInput
              style={styles.input}
              value={bankAcc}
              onChangeText={setBankAcc}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>IFSC Code *</Text>
            <TextInput
              style={styles.input}
              value={ifsc}
              onChangeText={setIfsc}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>UPI ID (For instant 30-sec transfer)</Text>
            <TextInput
              style={styles.input}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="e.g. mobile@upi"
            />
          </View>
        </View>

        {/* 3. Live Selfie */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Partner Live Photo</Text>
          <View style={styles.selfieBox}>
            <Text style={styles.selfieEmoji}>👷</Text>
            <Text style={styles.selfieText}>Live Face Matched (100%) ✓</Text>
          </View>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {isVerifying ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Verifying Bank & UIDAI records...</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitKyc}>
            <Text style={styles.submitBtnText}>Submit KYC & Activate Partner Account ✓</Text>
          </TouchableOpacity>
        )}
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
    padding: 16
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.small
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  field: {
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  verifiedIcon: {
    fontSize: 14,
    marginRight: 6
  },
  verifiedNote: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600'
  },
  selfieBox: {
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft
  },
  selfieEmoji: {
    fontSize: 40,
    marginBottom: 6
  },
  selfieText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 14
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6
  },
  submitBtn: {
    backgroundColor: COLORS.onlineGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  }
});
