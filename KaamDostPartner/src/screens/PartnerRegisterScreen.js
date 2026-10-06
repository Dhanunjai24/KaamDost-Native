import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

export default function PartnerRegisterScreen({ phone = '9848012345', onContinue, onBackToLogin }) {
  const [name, setName] = useState('Ramesh Reddy');
  const [age, setAge] = useState('32');
  const [selectedTrade, setSelectedTrade] = useState('masonry');
  const [dailyRate, setDailyRate] = useState('950');
  const [city, setCity] = useState('Sangareddy');
  const [expYears, setExpYears] = useState('8');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = async () => {
    if (!name.trim() || name.trim().length < 3) {
      setErrorMsg('Please enter your full name (at least 3 characters)');
      return;
    }
    const numAge = Number(age);
    if (!age || numAge < 18) {
      setErrorMsg('Partner must be at least 18 years old (e-Shram adult requirement)');
      return;
    }
    if (!dailyRate || Number(dailyRate) < 400) {
      setErrorMsg('Please enter a valid daily rate (minimum ₹400/day)');
      return;
    }

    setErrorMsg('');
    const tradeObj = TRADES_CATALOG.find(t => t.id === selectedTrade) || TRADES_CATALOG[0];
    const data = {
      name: name.trim(),
      phone,
      age: numAge,
      trade: selectedTrade,
      tradeName: tradeObj.name,
      dailyRate: Number(dailyRate),
      city: city.trim(),
      experienceYears: Number(expYears)
    };

    try {
      await api.registerWorker(data);
    } catch (e) {}

    onContinue(data);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B1320' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 3 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Professional Trade Profile</Text>
            <Text style={styles.subtitle}>వృత్తి వివరాలు & రోజువారీ రేటు సెటప్</Text>
            <Text style={styles.subtext}>Select your primary trade and standard daily wage</Text>
          </View>

          {/* Personal Info Card */}
          <GlassCard style={styles.card}>
            <Text style={styles.inputLabel}>Full Name (పూర్తి పేరు) *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ramesh Reddy"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Age (వయస్సు - 18+) *</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="32"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Experience (Years) *</Text>
                <TextInput
                  style={styles.input}
                  value={expYears}
                  onChangeText={setExpYears}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>
          </GlassCard>

          {/* Trade Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.sectionHeading}>Select Primary Trade (ప్రధాన వృత్తి) *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tradeScroll}>
              <View style={styles.tradeGrid}>
                {TRADES_CATALOG.slice(0, 10).map((t) => {
                  const isSelected = selectedTrade === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.tradeCard, isSelected && styles.tradeCardActive]}
                      onPress={() => {
                        setSelectedTrade(t.id);
                        if (t.defaultRate) setDailyRate(String(t.defaultRate));
                      }}
                    >
                      <Text style={styles.tradeIcon}>{t.icon || '🔨'}</Text>
                      <Text style={[styles.tradeName, isSelected && styles.tradeNameActive]}>{t.name}</Text>
                      <Text style={styles.tradeRate}>₹{t.defaultRate || 850}/day</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.row} style={{ marginTop: 14 }}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Daily Wage Rate (₹/రోజు) *</Text>
                <TextInput
                  style={styles.input}
                  value={dailyRate}
                  onChangeText={setDailyRate}
                  keyboardType="numeric"
                  placeholder="950"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Base City (పట్టణం) *</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Sangareddy"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
            </View>
          </GlassCard>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Next Button */}
          <View style={styles.footer}>
            <GlassButton
              title="Continue to Step 4: Service Base (ముందుకు) →"
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
  sectionHeading: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginTop: 8, marginBottom: 6 },
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
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },
  tradeScroll: { marginHorizontal: -4 },
  tradeGrid: { flexDirection: 'row', gap: 10, paddingVertical: 4 },
  tradeCard: {
    width: 110,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center'
  },
  tradeCardActive: {
    backgroundColor: 'rgba(255,107,0,0.2)',
    borderColor: '#FF6B00'
  },
  tradeIcon: { fontSize: 26, marginBottom: 6 },
  tradeName: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  tradeNameActive: { color: '#FF8800' },
  tradeRate: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  footer: { marginTop: 10 }
});
