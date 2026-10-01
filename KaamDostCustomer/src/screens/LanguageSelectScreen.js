import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SUPPORTED_LANGUAGES } from '../../../shared/i18n/languages';
import { setStoredLanguage } from '../../../shared/storage/storage';
import { setLanguage } from '../../../shared/i18n';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function LanguageSelectScreen({ onContinue, initialLanguage = null }) {
  const [selectedCode, setSelectedCode] = useState(initialLanguage);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectLanguage = (code) => {
    setSelectedCode(code);
    if (errorMessage) setErrorMessage('');
  };

  const handleContinue = async () => {
    if (!selectedCode) return;

    setSaving(true);
    setErrorMessage('');

    try {
      // 1. Save language preference persistently
      await setStoredLanguage(selectedCode);

      // 2. Initialize application language state
      setLanguage(selectedCode);

      setSaving(false);

      // 3. Navigate to existing Customer App next step
      if (onContinue) {
        onContinue(selectedCode);
      }
    } catch (error) {
      console.error('[LanguageSelectScreen] Failed to save language:', error);
      setSaving(false);
      setErrorMessage("Couldn't save your language preference. Please try again.");
    }
  };

  const isContinueEnabled = Boolean(selectedCode) && !saving;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>🌐</Text>
          </View>
          <Text style={styles.mainHeading}>Select Preferred Language</Text>
          <Text style={styles.supportingText}>Choose your preferred language to continue</Text>
        </View>

        {/* Error banner if saving failed */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Language List */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.languageCode;
            const showNative = lang.nativeName && lang.nativeName !== lang.languageName;

            return (
              <TouchableOpacity
                key={lang.languageCode}
                style={[
                  styles.languageCard,
                  isSelected && styles.languageCardSelected,
                ]}
                onPress={() => handleSelectLanguage(lang.languageCode)}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`${lang.languageName} ${showNative ? lang.nativeName : ''}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.cardTextCol}>
                  <Text
                    style={[
                      styles.languagePrimaryText,
                      isSelected && styles.languagePrimaryTextSelected,
                    ]}
                  >
                    {lang.languageName}
                  </Text>
                  {showNative && (
                    <Text
                      style={[
                        styles.languageNativeText,
                        isSelected && styles.languageNativeTextSelected,
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                  )}
                </View>

                {/* Selection Indicator (○ or ✓) */}
                <View
                  style={[
                    styles.indicatorCircle,
                    isSelected && styles.indicatorCircleSelected,
                  ]}
                >
                  {isSelected ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Continue CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isContinueEnabled && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isContinueEnabled}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            accessibilityState={{ disabled: !isContinueEnabled }}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text
                style={[
                  styles.continueButtonText,
                  !isContinueEnabled && styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  brandBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  brandIcon: {
    fontSize: 26,
  },
  mainHeading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 6,
  },
  supportingText: {
    fontSize: 14,
    color: '#5f7da6',
    fontWeight: '500',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 20,
    gap: 10,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    minHeight: 62,
    ...SHADOWS.sm,
  },
  languageCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    borderWidth: 1.6,
  },
  cardTextCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  languagePrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  languagePrimaryTextSelected: {
    color: '#2563eb',
    fontWeight: '800',
  },
  languageNativeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5f7da6',
  },
  languageNativeTextSelected: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  indicatorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  indicatorCircleSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  emptyCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    marginTop: -1,
  },
  footer: {
    paddingVertical: 14,
    paddingBottom: 18,
    backgroundColor: 'transparent',
  },
  continueButton: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...SHADOWS.primaryBtn,
  },
  continueButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  continueButtonTextDisabled: {
    color: '#94a3b8',
  },
});
