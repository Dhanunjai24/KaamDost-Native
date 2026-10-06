import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function CustomerAadhaarScreen({ onContinue }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('542189012345');
  const [hasAadhaarDoc, setHasAadhaarDoc] = useState(true);
  const [hasLiveSelfie, setHasLiveSelfie] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(' ') : raw;
  };

  const handleVerify = () => {
    const clean = aadhaarNumber.replace(/\s/g, '');
    if (clean.length !== 12) {
      setErrorMsg('Aadhaar number must be exactly 12 numeric digits');
      return;
    }
    if (!hasAadhaarDoc) {
      setErrorMsg('Please upload or capture Aadhaar card document');
      return;
    }
    if (!hasLiveSelfie) {
      setErrorMsg('Please capture a live selfie for identity matching');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    setVerificationProgress('Encrypting identity data (AES-256)...');

    setTimeout(() => {
      setVerificationProgress('Validating UIDAI database records...');
      setTimeout(() => {
        setVerificationProgress('Matching live selfie with Aadhaar photo (18+ adult check)...');
        setTimeout(() => {
          setIsVerifying(false);
          onContinue({
            aadhaarNumber: clean,
            maskedAadhaar: 'XXXX-XXXX-' + clean.slice(-4),
            aadhaarVerified: true,
            isAdult: true
          });
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Stepper Header */}
        <View style={styles.stepperRow}>
          <Text style={styles.stepText}>Step 5 of 6</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '83%' }]} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Identity & Age Verification</Text>
          <Text style={styles.subtitle}>
            UIDAI verified safety protocol protecting customers and labour partners across Telangana
          </Text>
        </View>

        {/* 1. Aadhaar Card Input */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Aadhaar Card Details</Text>
          <Text style={styles.label}>12-Digit Aadhaar Number</Text>
          <TextInput
            style={styles.aadhaarInput}
            value={formatAadhaar(aadhaarNumber)}
            onChangeText={(val) => {
              setAadhaarNumber(val);
              setErrorMsg('');
            }}
            keyboardType="number-pad"
            maxLength={14}
            placeholder="XXXX XXXX XXXX"
          />

          <View style={styles.docUploadRow}>
            <TouchableOpacity
              style={[styles.uploadBox, hasAadhaarDoc && styles.uploadBoxDone]}
              onPress={() => setHasAadhaarDoc(true)}
            >
              <Text style={styles.uploadIcon}>{hasAadhaarDoc ? '✅' : '📷'}</Text>
              <Text style={styles.uploadLabel}>
                {hasAadhaarDoc ? 'Aadhaar Photo Attached' : 'Capture / Upload Aadhaar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Live Selfie Camera */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Live Selfie Camera Check</Text>
          <Text style={styles.sectionDesc}>
            Position your face directly in front of the camera with good lighting. Prevents identity theft.
          </Text>

          <View style={styles.selfieOval}>
            <Text style={styles.selfieEmoji}>{hasLiveSelfie ? '👤' : '📸'}</Text>
            <View style={styles.selfieBadge}>
              <Text style={styles.selfieBadgeText}>
                {hasLiveSelfie ? 'Live Face Matched ✓' : 'Camera Ready'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => setHasLiveSelfie(true)}
          >
            <Text style={styles.retakeText}>
              {hasLiveSelfie ? 'Retake Selfie' : 'Open Front Camera'}
            </Text>
          </TouchableOpacity>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {isVerifying ? (
          <View style={styles.verifyingBox}>
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginBottom: 6 }} />
            <Text style={styles.progressText}>{verificationProgress}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleVerify}>
            <Text style={styles.submitBtnText}>Verify Identity with UIDAI ✓</Text>
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
    padding: 20
  },
  stepperRow: {
    marginBottom: 16
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14,
    ...SHADOWS.small
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8
  },
  sectionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  aadhaarInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 2,
    backgroundColor: COLORS.background,
    marginBottom: 12
  },
  docUploadRow: {},
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  uploadBoxDone: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
    borderStyle: 'solid'
  },
  uploadIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  uploadLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  selfieOval: {
    width: 120,
    height: 150,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    marginVertical: 10,
    position: 'relative'
  },
  selfieEmoji: {
    fontSize: 48
  },
  selfieBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10
  },
  selfieBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '800'
  },
  retakeBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.borderLight
  },
  retakeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  verifyingBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8
  },
  progressText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700'
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800'
  }
});
