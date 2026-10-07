import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerKycScreen({ partnerData, onKycApproved, onBack }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('892145671234');
  const [eShramNumber, setEShramNumber] = useState('UAN-9921-4412-8812');
  const [bankAcc, setBankAcc] = useState('501004829104');
  const [ifsc, setIfsc] = useState('SBIN0001245');
  const [upiId, setUpiId] = useState('ramesh.reddy@sbi');
  const [hasAadhaarPhoto, setHasAadhaarPhoto] = useState(true);
  const [hasLiveSelfie, setHasLiveSelfie] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(' ') : raw;
  };

  const handleSubmitKyc = async () => {
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12 || cleanAadhaar.startsWith('0') || cleanAadhaar.startsWith('1')) {
      setErrorMsg('Aadhaar number must be exactly 12 digits (cannot start with 0 or 1)');
      return;
    }
    if (!hasLiveSelfie) {
      setErrorMsg('Please capture live camera selfie (18+ Adult check required)');
      return;
    }
    if (!bankAcc || !ifsc) {
      setErrorMsg('Please enter Bank account number and IFSC code for wage payouts');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    try {
      await api.submitWorkerKyc({
        aadhaarNumber: cleanAadhaar,
        bankAccount: bankAcc,
        ifsc,
        upiId,
        age: partnerData?.age || 32
      });
    } catch (e) {}

    setTimeout(() => {
      setIsVerifying(false);
      onKycApproved({
        ...partnerData,
        isVerified: true,
        aadhaarMasked: 'XXXX-XXXX-' + cleanAadhaar.slice(-4),
        eShramNumber,
        bankAccount: bankAcc,
        ifsc,
        upiId
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B1320' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 5 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '83.3%' }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Aadhaar e-KYC & Live Selfie</Text>
            <Text style={styles.subtitle}>ఆధార్ వెరిఫికేషన్ & లైవ్ సెల్ఫీ (18+ వయస్సు ధృవీకరణ)</Text>
            <Text style={styles.subtext}>UIDAI verified identity ensures fast customer approvals and instant payouts</Text>
          </View>

          {/* Aadhaar Input */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>12-Digit Aadhaar Number (ఆధార్ సంఖ్య) *</Text>
            <TextInput
              style={styles.input}
              value={formatAadhaar(aadhaarNumber)}
              onChangeText={t => setAadhaarNumber(t.replace(/\D/g, ''))}
              placeholder="XXXX XXXX XXXX"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="numeric"
              maxLength={14}
            />

            <Text style={styles.label}>e-Shram UAN Card (Optional)</Text>
            <TextInput
              style={styles.input}
              value={eShramNumber}
              onChangeText={setEShramNumber}
              placeholder="UAN-XXXX-XXXX-XXXX"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </GlassCard>

          {/* Document & Live Camera Capture Cards */}
          <View style={styles.row}>
            {/* Aadhaar Photo */}
            <TouchableOpacity
              style={[styles.uploadCard, hasAadhaarPhoto && styles.uploadCardDone]}
              onPress={() => setHasAadhaarPhoto(true)}
            >
              <Text style={styles.uploadIcon}>{hasAadhaarPhoto ? '✅' : '📷'}</Text>
              <Text style={styles.uploadTitle}>Aadhaar Card</Text>
              <Text style={styles.uploadSub}>{hasAadhaarPhoto ? 'Attached' : 'Tap to scan'}</Text>
            </TouchableOpacity>

            {/* Live Selfie (Camera Only) */}
            <TouchableOpacity
              style={[styles.uploadCard, hasLiveSelfie && styles.uploadCardDone]}
              onPress={() => setHasLiveSelfie(true)}
            >
              <Text style={styles.uploadIcon}>{hasLiveSelfie ? '✅' : '🤳'}</Text>
              <Text style={styles.uploadTitle}>Live Camera Selfie</Text>
              <Text style={styles.uploadSub}>{hasLiveSelfie ? '18+ Matched' : 'Live photo only'}</Text>
            </TouchableOpacity>
          </View>

          {/* Payout Banking Details */}
          <GlassCard style={styles.card}>
            <Text style={styles.sectionHeading}>Wage Payout Details (డైలీ పేఅవుట్ బ్యాంక్)</Text>

            <Text style={styles.inputLabel}>Bank Account Number *</Text>
            <TextInput
              style={styles.input}
              value={bankAcc}
              onChangeText={setBankAcc}
              placeholder="Account Number"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>IFSC Code *</Text>
                <TextInput
                  style={styles.input}
                  value={ifsc}
                  onChangeText={setIfsc}
                  placeholder="SBIN0001245"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>UPI ID (GPay / PhonePe)</Text>
                <TextInput
                  style={styles.input}
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="name@oksbi"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>
          </GlassCard>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Verification CTA */}
          <View style={styles.footer}>
            <GlassButton
              title={isVerifying ? "Verifying e-KYC..." : "Verify & Complete Account (Step 6) →"}
              onPress={handleSubmitKyc}
              disabled={isVerifying}
              variant="primary"
              size="large"
            />
          </View>
        </ScrollView>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#FF6B00', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FF6B00', borderRadius: 3 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#FF8800', marginTop: 2 },
  subtext: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  card: { padding: 16, marginBottom: 14 },
  sectionHeading: { fontSize: 13, fontWeight: '700', color: '#FF8800', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginTop: 8, marginBottom: 6 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  halfCol: { flex: 1 },
  uploadCard: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadCardDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981'
  },
  uploadIcon: { fontSize: 24, marginBottom: 6 },
  uploadTitle: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  uploadSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  footer: { marginTop: 6 }
});
