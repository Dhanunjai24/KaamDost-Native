import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGES, setLanguage } from '../../../shared/i18n';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassButton from '../../../shared/components/glass/GlassButton';

export default function PartnerLanguageScreen({ onContinue }) {
  const [selectedLang, setSelectedLang] = useState('te');

  const handleSelect = (code) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleNext = () => {
    setLanguage(selectedLang);
    onContinue(selectedLang);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F4F8FC' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
      <GlassBackground>
        <View style={styles.container}>
          {/* Stepper Header */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepBadge}>Step 1 of 6</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '16.6%' }]} />
            </View>
          </View>

          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>👷</Text>
            </View>
            <Text style={styles.title}>Select Working Language</Text>
            <Text style={styles.subtitle}>దయచేసి మీ పని భాషను ఎంచుకోండి</Text>
            <Text style={styles.subtext}>Choose the language you prefer for job offers and navigation</Text>
          </View>

          {/* Language Cards */}
          <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardLeft}>
                    <Text style={styles.nativeLabel}>{lang.name}</Text>
                    <Text style={styles.engLabel}>{lang.label}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Bottom CTA */}
          <View style={styles.footer}>
            <GlassButton
              title="Continue to Login →"
              onPress={handleNext}
              variant="primary"
              size="large"
            />
          </View>
        </View>
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, justifyContent: 'space-between', paddingBottom: 16 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  stepBadge: { fontSize: 12, fontWeight: '700', color: '#173F6B', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(11, 35, 65, 0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#0B2341', borderRadius: 3 },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  logoBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(23, 63, 107, 0.12)', borderWidth: 1.5, borderColor: 'rgba(23, 63, 107, 0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoEmoji: { fontSize: 32 },
  title: { fontSize: 22, fontWeight: '800', color: '#0B2341', letterSpacing: 0.3, textAlign: 'center' },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#173F6B', marginTop: 4, textAlign: 'center' },
  subtext: { fontSize: 12, color: '#48627D', marginTop: 6, textAlign: 'center' },
  scroll: { flex: 1 },
  list: { gap: 12, paddingBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1.2, borderColor: 'rgba(11, 35, 65, 0.12)' },
  cardSelected: { backgroundColor: 'rgba(23, 63, 107, 0.10)', borderColor: '#0B2341' },
  cardLeft: { flex: 1 },
  nativeLabel: { fontSize: 18, fontWeight: '700', color: '#0B2341' },
  engLabel: { fontSize: 13, color: '#48627D', marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(11, 35, 65, 0.3)', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#0B2341' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0B2341' },
  footer: { paddingVertical: 8 }
});
