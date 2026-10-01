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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconBox}>
            <Text style={styles.headerEmoji}>🛡️</Text>
          </View>
          <Text style={styles.title}>Account Completion</Text>
          <Text style={styles.subtitle}>Structured Help, Better Living</Text>
        </View>

        {/* Verification Checklist Card matching screen_08 */}
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
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  headerEmoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f294a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 16,
  },
  stepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greenCheckBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f294a',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 10,
  },
  successHeadline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
