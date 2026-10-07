import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { GENDER_OPTIONS, TELANGANA_CITIES } from '../../../shared/constants/cities';
import { t } from '../../../shared/i18n';

export default function CustomerAddressScreen({ onContinue }) {
  const [gender, setGender] = useState('male');
  const [addressType, setAddressType] = useState('Home');
  const [houseNo, setHouseNo] = useState('Plot 42');
  const [street, setStreet] = useState('Near Old Bus Stand Road');
  const [landmark, setLandmark] = useState('Opposite SBI Bank');
  const [city, setCity] = useState('Sangareddy');
  const [pincode, setPincode] = useState('502001');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseGps = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      setIsDetectingGps(false);
      setHouseNo('Flat 302, Sri Sai Nilayam');
      setStreet('Balaji Nagar Main Road');
      setLandmark('Near Collectorate');
      setCity('Sangareddy');
      setPincode('502001');
    }, 1000);
  };

  const handleNext = () => {
    if (!houseNo || !street || !city || !pincode) {
      setErrorMsg('Please complete all address fields');
      return;
    }
    setErrorMsg('');
    onContinue({
      gender,
      address: {
        type: addressType,
        houseNo,
        street,
        landmark,
        city,
        state: 'Telangana',
        pincode
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Stepper Header */}
        <View style={styles.stepperRow}>
          <Text style={styles.stepText}>Step 4 of 6</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Gender & Service Address</Text>
          <Text style={styles.subtitle}>Help us match nearby Dosts and dispatch services to your exact doorstep</Text>
        </View>

        {/* 1. Gender Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Select Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((g) => {
              const active = gender === g.value;
              return (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderBtn, active && styles.genderBtnActive]}
                  onPress={() => setGender(g.value)}
                >
                  <Text style={[styles.genderText, active && styles.genderTextActive]}>
                    {g.value === 'male' ? '👨 Male' : g.value === 'female' ? '👩 Female' : '👤 Others'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Address Form */}
        <View style={styles.card}>
          <View style={styles.addrHeaderRow}>
            <Text style={styles.sectionTitle}>2. Service Address</Text>
            <TouchableOpacity
              style={styles.gpsBtn}
              onPress={handleUseGps}
              disabled={isDetectingGps}
            >
              <Text style={styles.gpsText}>
                {isDetectingGps ? 'Detecting...' : '📍 Use GPS'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Address Type Tags */}
          <View style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, addressType === t && styles.typeBtnActive]}
                onPress={() => setAddressType(t)}
              >
                <Text style={[styles.typeText, addressType === t && styles.typeTextActive]}>
                  {t === 'Home' ? '🏠 Home' : t === 'Work' ? '🏢 Work' : '📍 Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>House / Flat / Door Number *</Text>
            <TextInput
              style={styles.input}
              value={houseNo}
              onChangeText={setHouseNo}
              placeholder="e.g. Plot 42 / Flat 301"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Street / Colony / Area *</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="e.g. Near Old Bus Stand Road"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g. Opposite SBI Bank"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>District / City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Sangareddy"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="502001"
              />
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
            <Text style={styles.submitBtnText}>Save Address & Continue →</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 4
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
    marginBottom: 10
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  genderBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  genderText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  genderTextActive: {
    color: COLORS.primaryDark
  },
  addrHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  gpsBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  typeBtnActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  typeTextActive: {
    color: COLORS.textWhite
  },
  field: {
    marginBottom: 12
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
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
