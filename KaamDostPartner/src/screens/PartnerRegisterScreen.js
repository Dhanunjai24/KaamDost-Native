import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import { TELANGANA_CITIES } from '../../../shared/constants/cities';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function PartnerRegisterScreen({ onContinue, onBackToLogin }) {
  const [name, setName] = useState('Ramesh Reddy');
  const [phone, setPhone] = useState('9848012345');
  const [age, setAge] = useState('32');
  const [selectedTrade, setSelectedTrade] = useState('masonry');
  const [dailyRate, setDailyRate] = useState('950');
  const [city, setCity] = useState('Sangareddy');
  const [expYears, setExpYears] = useState('8');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!name || !phone || !dailyRate) {
      setErrorMsg('Please complete all required fields');
      return;
    }
    const tradeObj = TRADES_CATALOG.find(t => t.id === selectedTrade) || TRADES_CATALOG[0];
    onContinue({
      name,
      phone,
      age,
      trade: selectedTrade,
      tradeName: tradeObj.name,
      dailyRate: Number(dailyRate),
      city,
      experienceYears: Number(expYears)
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackToLogin} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Worker Partner Registration</Text>
            <Text style={styles.subtitle}>Telangana State Labour Board standard onboarding</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name (As on Aadhaar) *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ramesh Reddy"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Age (Must be 18+) *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>

          {/* Primary Trade Selection */}
          <View style={styles.field}>
            <Text style={styles.label}>Select Primary Skill / Trade *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tradesRow}>
              {TRADES_CATALOG.map((tr) => {
                const active = selectedTrade === tr.id;
                return (
                  <TouchableOpacity
                    key={tr.id}
                    style={[styles.tradePill, active && styles.tradePillActive]}
                    onPress={() => {
                      setSelectedTrade(tr.id);
                      setDailyRate(String(tr.dailyRate));
                    }}
                  >
                    <Text style={[styles.tradePillText, active && styles.tradePillTextActive]}>
                      {tr.name} (₹{tr.dailyRate})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Daily Wage Expected (₹) *</Text>
              <TextInput
                style={styles.input}
                value={dailyRate}
                onChangeText={setDailyRate}
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Experience (Years) *</Text>
              <TextInput
                style={styles.input}
                value={expYears}
                onChangeText={setExpYears}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Primary Working City / District *</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Sangareddy"
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
            <Text style={styles.submitBtnText}>Continue to Document Verification →</Text>
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
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backBtn: {
    paddingRight: 10
  },
  backText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary
  },
  headerInfo: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
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
    marginBottom: 6
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background
  },
  tradesRow: {
    gap: 8,
    paddingVertical: 4
  },
  tradePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  tradePillActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary
  },
  tradePillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  tradePillTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800'
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
    marginTop: 8,
    ...SHADOWS.small
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800'
  }
});
