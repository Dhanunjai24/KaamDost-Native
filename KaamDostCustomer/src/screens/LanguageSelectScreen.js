import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { LANGUAGES, setLanguage, t } from '../../../shared/i18n';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function LanguageSelectScreen({ onContinue }) {
  const [selectedLang, setSelectedLang] = useState('te'); // Telangana primary default

  const handleSelect = (code) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleNext = () => {
    setLanguage(selectedLang);
    onContinue(selectedLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🇮🇳</Text>
          </View>
          <Text style={styles.title}>Select Your Language</Text>
          <Text style={styles.subtitle}>దయచేసి మీ ప్రాధాన్య భాషను ఎంచుకోండి</Text>
        </View>

        {/* Language Grid / List */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.75}
              >
                <View style={styles.leftCol}>
                  <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
                    {lang.name}
                  </Text>
                  <Text style={styles.langLabel}>{lang.label}</Text>
                </View>

                <View style={styles.rightCol}>
                  <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                    <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                      {lang.badge}
                    </Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>{t('continue')} →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  logoEmoji: {
    fontSize: 28
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4
  },
  scroll: {
    flex: 1
  },
  list: {
    gap: 10,
    paddingBottom: 20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  leftCol: {},
  langName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  langNameSelected: {
    color: COLORS.primaryDark
  },
  langLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeSelected: {
    backgroundColor: '#ffedd5'
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  badgeTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioSelected: {
    borderColor: COLORS.primary
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary
  },
  footer: {
    paddingVertical: 16
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  continueBtnText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '800'
  }
});
