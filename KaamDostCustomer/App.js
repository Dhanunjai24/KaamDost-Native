import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

// Step 1: Language Selection and Internationalization Foundation
import LanguageSelectScreen from './src/screens/LanguageSelectScreen';
import {
  getStoredLanguage,
  clearStoredLanguage,
} from '../shared/storage/storage';
import { setLanguage } from '../shared/i18n';
import { getLanguageByCode } from '../shared/i18n/languages';
import { COLORS, SHADOWS } from '../shared/theme/theme';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState(null);

  // 1. Startup Language Check
  useEffect(() => {
    async function initLanguage() {
      try {
        const stored = await getStoredLanguage();
        if (stored) {
          setPreferredLanguage(stored);
          setLanguage(stored);
        }
      } catch (err) {
        console.warn('[Startup] Failed to check language preference:', err);
      } finally {
        setLoading(false);
      }
    }
    initLanguage();
  }, []);

  const handleLanguageSelected = (code) => {
    setPreferredLanguage(code);
    setLanguage(code);
  };

  const handleResetForTesting = async () => {
    await clearStoredLanguage();
    setPreferredLanguage(null);
  };

  // Smooth loading indicator during initial storage read to prevent screen flash
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
        <View style={styles.loadingBox}>
          <Text style={styles.loadingLogo}>KD</Text>
          <ActivityIndicator size="small" color="#2563eb" style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  // FIRST-TIME USER: No language selected yet -> Render "Select Preferred Language"
  if (!preferredLanguage) {
    return (
      <LanguageSelectScreen
        onContinue={handleLanguageSelected}
      />
    );
  }

  // RETURNING USER: Language already exists -> Skip Language Selection
  // Render temporary placeholder for the next step as specified in Step 1 rules
  const currentLangObj = getLanguageByCode(preferredLanguage);

  return (
    <SafeAreaView style={styles.placeholderSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.placeholderContainer}>
        {/* Brand Card */}
        <View style={styles.placeholderCard}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>KD</Text>
          </View>

          <Text style={styles.placeholderTitle}>KaamDost Customer App</Text>
          <Text style={styles.placeholderSubtitle}>Step 1 Foundation Initialized</Text>

          <View style={styles.langInfoBox}>
            <Text style={styles.langInfoLabel}>Current Language Preference:</Text>
            <Text style={styles.langInfoValue}>
              {currentLangObj ? `${currentLangObj.name} (${currentLangObj.nativeName})` : preferredLanguage}
            </Text>
            <Text style={styles.langInfoCode}>Code: {preferredLanguage}</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>✓ Step 1 Complete • Ready for Step 2</Text>
          </View>
        </View>

        {/* Test Controls */}
        <View style={styles.testControlCard}>
          <Text style={styles.testControlTitle}>Testing Controls</Text>
          <Text style={styles.testControlDesc}>
            Use this to verify Test 5 & Test 6 (clearing saved language to test fresh launch).
          </Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetForTesting}
            activeOpacity={0.8}
          >
            <Text style={styles.resetBtnText}>Clear Language Preference & Restart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f0f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563eb',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    ...SHADOWS.sm,
  },
  placeholderSafeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  placeholderContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...SHADOWS.md,
    marginTop: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2563eb',
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#5f7da6',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  langInfoBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  langInfoLabel: {
    fontSize: 12,
    color: '#5f7da6',
    fontWeight: '600',
    marginBottom: 4,
  },
  langInfoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 2,
  },
  langInfoCode: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
  },
  testControlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  testControlTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 4,
  },
  testControlDesc: {
    fontSize: 12,
    color: '#5f7da6',
    lineHeight: 16,
    marginBottom: 14,
  },
  resetBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
});
