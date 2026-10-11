import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRADES_CATALOG } from '../../../shared/constants/trades';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import api from '../../../shared/api/client';

const POPULAR_TRADE_IDS = [
  'masonry',
  'electrical',
  'plumbing',
  'carpentry',
  'painting',
  'tile_marble',
  'centering',
  'bar_bending',
  'welding',
  'helper'
];

export default function PartnerRegisterScreen({ lang = 'te', phone = '', onContinue, onBackToLogin }) {
  const isTe = lang === 'te';
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('masonry');
  const [customTrade, setCustomTrade] = useState('');
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [dailyRate, setDailyRate] = useState('950');
  const [city, setCity] = useState('');
  const [expYears, setExpYears] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const displayedTrades = showAllTrades
    ? TRADES_CATALOG
    : TRADES_CATALOG.filter(t => POPULAR_TRADE_IDS.includes(t.id) || t.id === selectedTrade);

  const handleNext = async () => {
    if (!name.trim() || name.trim().length < 3) {
      setErrorMsg(isTe ? 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి (కనీసం 3 అక్షరాలు)' : 'Please enter your full name (at least 3 characters)');
      return;
    }
    const numAge = Number(age);
    if (!age || numAge < 18) {
      setErrorMsg(isTe ? 'పార్ట్‌నర్ తప్పనిసరిగా కనీసం 18 సంవత్సరాలు నిండి ఉండాలి' : 'Partner must be at least 18 years old (e-Shram adult requirement)');
      return;
    }
    if (selectedTrade === 'others' && (!customTrade.trim() || customTrade.trim().length < 2)) {
      setErrorMsg(isTe ? 'దయచేసి మీ వృత్తి పేరు నమోదు చేయండి (కనీసం 2 అక్షరాలు)' : 'Please enter your trade name (at least 2 characters)');
      return;
    }
    if (!dailyRate || Number(dailyRate) < 400) {
      setErrorMsg(isTe ? 'దయచేసి సరైన రోజువారీ వేతనాన్ని నమోదు చేయండి (కనీసం ₹400/రోజు)' : 'Please enter a valid daily rate (minimum ₹400/day)');
      return;
    }

    setErrorMsg('');
    const tradeObj = TRADES_CATALOG.find(t => t.id === selectedTrade);
    const resolvedTradeName = selectedTrade === 'others'
      ? customTrade.trim()
      : (tradeObj?.name || 'Worker');

    const data = {
      name: name.trim(),
      phone,
      age: numAge,
      trade: selectedTrade === 'others' ? (customTrade.trim().toLowerCase().replace(/\s+/g, '_') || 'others') : selectedTrade,
      tradeName: resolvedTradeName,
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F4F8FC' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
      <GlassBackground>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>{isTe ? 'దశ 3 / 6' : 'Step 3 of 6'}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>{isTe ? 'వృత్తి ప్రొఫైల్ వివరాలు' : 'Professional Trade Profile'}</Text>
            <Text style={styles.subtext}>
              {isTe ? 'మీ ప్రధాన వృత్తి మరియు రోజువారీ ప్రామాణిక వేతనాన్ని ఎంచుకోండి' : 'Select your primary trade and standard daily wage'}
            </Text>
          </View>

          {/* Personal Info Card */}
          <GlassCard style={styles.card}>
            <Text style={styles.inputLabel}>{isTe ? 'పూర్తి పేరు *' : 'Full Name *'}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={isTe ? 'మీ పూర్తి పేరును నమోదు చేయండి' : 'Enter your full name'}
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'వయస్సు (18+) *' : 'Age (18+) *'}</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="32"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'అనుభవం (సంవత్సరాలు) *' : 'Experience (Years) *'}</Text>
                <TextInput
                  style={styles.input}
                  value={expYears}
                  onChangeText={setExpYears}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </GlassCard>

          {/* Trade Selection */}
          <GlassCard style={styles.card}>
            <Text style={styles.sectionHeading}>{isTe ? 'ప్రధాన వృత్తిని ఎంచుకోండి *' : 'Select Primary Trade *'}</Text>
            
            {/* Options List */}
            <View style={styles.optionsContainer}>
              {displayedTrades.map((t) => {
                const isSelected = selectedTrade === t.id;
                const displayName = isTe ? (t.telugu || t.name) : t.name;
                const rateText = isTe ? `₹${t.dailyRate || t.defaultRate || 850}/రోజు` : `₹${t.dailyRate || t.defaultRate || 850}/day`;
                return (
                  <TouchableOpacity
                    key={t.id}
                    activeOpacity={0.7}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => {
                      setSelectedTrade(t.id);
                      if (t.dailyRate || t.defaultRate) setDailyRate(String(t.dailyRate || t.defaultRate));
                      setErrorMsg('');
                    }}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.optionEmoji}>{t.emoji || '🔨'}</Text>
                    <View style={styles.optionInfo}>
                      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                        {displayName}
                      </Text>
                    </View>
                    <View style={[styles.rateBadge, isSelected && styles.rateBadgeSelected]}>
                      <Text style={[styles.rateBadgeText, isSelected && styles.rateBadgeTextSelected]}>
                        {rateText}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Toggle to view all trades */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.moreTradesBtn}
                onPress={() => setShowAllTrades(!showAllTrades)}
              >
                <Text style={styles.moreTradesText}>
                  {isTe
                    ? (showAllTrades ? '▲ ముఖ్యమైన 10 వృత్తులు' : `▼ మొత్తం ${TRADES_CATALOG.length} వృత్తులు చూడండి`)
                    : (showAllTrades ? '▲ Show Top 10 Trades' : `▼ View All ${TRADES_CATALOG.length} Trades`)}
                </Text>
              </TouchableOpacity>

              {/* Others Option */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.optionRow, selectedTrade === 'others' && styles.optionRowSelected]}
                onPress={() => {
                  setSelectedTrade('others');
                  setErrorMsg('');
                }}
              >
                <View style={[styles.radioCircle, selectedTrade === 'others' && styles.radioCircleActive]}>
                  {selectedTrade === 'others' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionEmoji}>✏️</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, selectedTrade === 'others' && styles.optionTitleSelected]}>
                    {isTe ? 'ఇతర వృత్తి' : 'Others'}
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    {isTe ? 'మీ వృత్తి ఇక్కడ లేకపోతే నమోదు చేయండి' : 'Select to enter your custom trade'}
                  </Text>
                </View>
                <View style={[styles.customBadge, selectedTrade === 'others' && styles.customBadgeSelected]}>
                  <Text style={[styles.customBadgeText, selectedTrade === 'others' && styles.customBadgeTextSelected]}>
                    {isTe ? 'ఇతర' : 'Other'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Enter Your Trade Input Box when Others is selected */}
              {selectedTrade === 'others' && (
                <View style={styles.customTradeContainer}>
                  <Text style={styles.customTradeLabel}>
                    {isTe ? 'మీ వృత్తి పేరు నమోదు చేయండి *' : 'Enter your trade *'}
                  </Text>
                  <TextInput
                    style={styles.customTradeInput}
                    value={customTrade}
                    onChangeText={(val) => {
                      setCustomTrade(val);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder={isTe ? 'మీ వృత్తి పేరు (ఉదా: వెల్డర్, డ్రైవర్, కమ్మరి...)' : 'Enter your trade (e.g. Welder, Blacksmith, Driver...)'}
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="words"
                    autoFocus
                  />
                </View>
              )}
            </View>

            <View style={[styles.row, { marginTop: 14 }]}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'రోజువారీ వేతనం (₹/రోజు) *' : 'Daily Wage Rate (₹/day) *'}</Text>
                <TextInput
                  style={styles.input}
                  value={dailyRate}
                  onChangeText={setDailyRate}
                  keyboardType="numeric"
                  placeholder="950"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>{isTe ? 'నగరం / పట్టణం *' : 'Base City *'}</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder={isTe ? 'సంగారెడ్డి' : 'Sangareddy'}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </GlassCard>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Next Button */}
          <View style={styles.footer}>
            <GlassButton
              title={isTe ? 'దశ 4 కి కొనసాగించండి: సర్వీస్ స్థావరం →' : 'Continue to Step 4: Service Base →'}
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
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#173F6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(11, 35, 65, 0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0B2341', borderRadius: 3 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0B2341', letterSpacing: 0.3 },
  subtext: { fontSize: 12, color: '#48627D', marginTop: 4 },
  card: { padding: 16, marginBottom: 14 },
  sectionHeading: { fontSize: 13, fontWeight: '700', color: '#0B2341', marginBottom: 10 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#0B2341', marginTop: 8, marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0B2341',
    fontSize: 14
  },
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },
  optionsContainer: { marginVertical: 4 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(11, 35, 65, 0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8
  },
  optionRowSelected: {
    borderColor: '#0B2341',
    backgroundColor: 'rgba(11, 35, 65, 0.05)',
    borderWidth: 1.5
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  radioCircleActive: {
    borderColor: '#0B2341'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B2341'
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 10
  },
  optionInfo: {
    flex: 1,
    paddingRight: 6
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B2341'
  },
  optionTitleSelected: {
    fontWeight: '700',
    color: '#0B2341'
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  rateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  rateBadgeSelected: {
    backgroundColor: '#0B2341',
    borderColor: '#0B2341'
  },
  rateBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },
  rateBadgeTextSelected: {
    color: '#FFFFFF'
  },
  customBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  customBadgeSelected: {
    backgroundColor: '#0B2341',
    borderColor: '#0B2341'
  },
  customBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  customBadgeTextSelected: {
    color: '#FFFFFF'
  },
  moreTradesBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8
  },
  moreTradesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#173F6B',
    textDecorationLine: 'underline'
  },
  customTradeContainer: {
    marginTop: 4,
    marginBottom: 10,
    padding: 12,
    backgroundColor: 'rgba(23, 63, 107, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(11, 35, 65, 0.15)'
  },
  customTradeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B2341',
    marginBottom: 6
  },
  customTradeInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B2341',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0B2341',
    fontSize: 14,
    fontWeight: '600'
  },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  footer: { marginTop: 10 }
});
