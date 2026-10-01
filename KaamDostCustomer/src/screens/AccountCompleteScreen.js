import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function AccountCompleteScreen({ customer, onProceedHome }) {
  const stepsCompleted = [
    { id: 1, label: 'Mobile Verified' },
    { id: 2, label: 'Name Added' },
    { id: 3, label: 'Aadhaar Verified' },
    { id: 4, label: 'Address' },
    { id: 5, label: 'Photo' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header with Blue lock icon badge */}
        <View style={styles.header}>
          <View style={styles.headerIconBox}>
            <Text style={styles.headerEmoji}>🔒</Text>
          </View>
          <Text style={styles.title}>Account Completion</Text>
          <Text style={styles.subtitle}>Structured Help, Better Living</Text>
        </View>

        {/* Verification Stack: Frosted card listing completed steps with bold green checks */}
        <View style={styles.checklistCard}>
          {stepsCompleted.map((step, idx) => (
            <View
              key={step.id}
              style={[
                styles.stepRow,
                idx < stepsCompleted.length - 1 && styles.stepDivider,
              ]}
            >
              <View style={styles.greenCheckBadge}>
                <Text style={styles.checkMarkIcon}>✓</Text>
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Callout & Continue Button */}
        <View style={styles.footer}>
          <Text style={styles.successHeadline}>Your account is complete!</Text>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={onProceedHome}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
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
    paddingTop: 36,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  headerEmoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f2c6e',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f7da6',
    marginTop: 4,
    fontWeight: '500',
  },
  checklistCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.md,
    marginVertical: 'auto',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  stepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.65)',
  },
  greenCheckBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkMarkIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#16a34a',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2c6e',
  },
  footer: {
    paddingTop: 16,
  },
  successHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2c6e',
    textAlign: 'center',
    marginBottom: 14,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.primaryBtn,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
