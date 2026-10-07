import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerAddressScreen({ partnerData, onContinue, onBack }) {
  const [gender, setGender] = useState('male');
  const [baseType, setBaseType] = useState('Workshop');
  const [street, setStreet] = useState('Industrial Area Road, Near Petrol Pump');
  const [landmark, setLandmark] = useState('Opposite Labour Chowk');
  const [city, setCity] = useState(partnerData?.city || 'Sangareddy');
  const [pincode, setPincode] = useState('502001');
  const [serviceRadiusKm, setServiceRadiusKm] = useState('15');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseGps = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      setIsDetectingGps(false);
      setStreet('Near Municipal Complex & Labour Adda');
      setLandmark('Collectorate Junction');
      setCity('Sangareddy');
      setPincode('502001');
    }, 900);
  };

  const handleNext = async () => {
    if (!street || !city || pincode.length !== 6) {
      setErrorMsg('Please enter street address, city and valid 6-digit PIN code');
      return;
    }

    setErrorMsg('');
    const addressData = {
      gender,
      baseType,
      street,
      landmark,
      city,
      pincode,
      serviceRadiusKm: Number(serviceRadiusKm)
    };

    try {
      await api.saveWorkerLocation(addressData);
    } catch (e) {}

    onContinue(addressData);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B1320' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 4 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66.6%' }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Service Base & Location</Text>
            <Text style={styles.subtitle}>మీ పని స్థావరం & సర్వీస్ లొకేషన్ సెటప్</Text>
            <Text style={styles.subtext}>Set your workshop or home base to receive nearby daily jobs</Text>
          </View>

          {/* Gender Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>Gender (లింగము)</Text>
            <View style={styles.pillRow}>
              {['male', 'female', 'other'].map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.pill, gender === g && styles.pillActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.pillText, gender === g && styles.pillTextActive]}>
                    {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '⚧ Other'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Base Type Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>Base Location Type</Text>
            <View style={styles.pillRow}>
              {['Workshop', 'Warehouse', 'Home Base'].map(b => (
                <TouchableOpacity
                  key={b}
                  style={[styles.pill, baseType === b && styles.pillActive]}
                  onPress={() => setBaseType(b)}
                >
                  <Text style={[styles.pillText, baseType === b && styles.pillTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* GPS Auto-Detect Button */}
          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={handleUseGps}
            disabled={isDetectingGps}
          >
            <Text style={styles.gpsIcon}>📍</Text>
            <Text style={styles.gpsBtnText}>
              {isDetectingGps ? 'Detecting GPS Coordinates...' : 'Use Current GPS Location (ఆటో డిటెక్ట్)'}
            </Text>
          </TouchableOpacity>

          {/* Address Fields */}
          <GlassCard style={styles.card}>
            <Text style={styles.inputLabel}>Workshop / Street Address *</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="Shop No, Street, Road, Colony"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <Text style={styles.inputLabel}>Landmark (ల్యాండ్‌మార్క్)</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Near bus stop, temple, chowk"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>City / District *</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Sangareddy"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>PIN Code (6 digits) *</Text>
                <TextInput
                  style={styles.input}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="502001"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>
          </GlassCard>

          {/* Job Dispatch Radius */}
          <GlassCard style={styles.card}>
            <Text style={styles.label}>Job Dispatch Radius (పని స్వీకరించే పరిధి)</Text>
            <View style={styles.pillRow}>
              {['5', '10', '15', '25'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.pill, serviceRadiusKm === r && styles.pillActive]}
                  onPress={() => setServiceRadiusKm(r)}
                >
                  <Text style={[styles.pillText, serviceRadiusKm === r && styles.pillTextActive]}>
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Next Button */}
          <View style={styles.footer}>
            <GlassButton
              title="Continue to Step 5: KYC Verification →"
              onPress={handleNext}
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
  label: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 },
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
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  pillActive: {
    backgroundColor: 'rgba(255,107,0,0.2)',
    borderColor: '#FF6B00'
  },
  pillText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  pillTextActive: { color: '#FF8800', fontWeight: '700' },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.4)',
    marginBottom: 16,
    gap: 8
  },
  gpsIcon: { fontSize: 18 },
  gpsBtnText: { fontSize: 13, fontWeight: '700', color: '#FF8800' },
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  footer: { marginTop: 10 }
});
