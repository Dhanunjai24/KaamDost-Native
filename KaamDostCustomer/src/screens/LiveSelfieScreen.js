import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function LiveSelfieScreen({ onContinue, onBack }) {
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setCaptured(true);
      setTimeout(() => {
        if (onContinue) {
          onContinue({ photoVerified: true });
        }
      }, 700);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Top Back Navigation Arrow */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        {/* Heading Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Live Selfie</Text>
          <Text style={styles.subtitle}>Take a clear selfie for verification</Text>
        </View>

        {/* Center View: Circular selfie frame with dashed blue progress ring */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.ringOffset}>
            <View style={styles.dashedRing}>
              <View style={styles.faceCircle}>
                <View style={styles.avatarMockup}>
                  <Text style={styles.avatarEmoji}>👨</Text>
                </View>
                {captured && (
                  <View style={styles.capturedBadge}>
                    <Text style={styles.capturedCheck}>✓</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Shutter Camera Button & Microcopy */}
        <View style={styles.shutterSection}>
          <TouchableOpacity
            style={styles.shutterBtn}
            onPress={handleCapture}
            disabled={capturing || captured}
            activeOpacity={0.8}
          >
            {capturing ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.cameraIcon}>📷</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.lightingHint}>
            {captured ? 'Selfie captured successfully! ✓' : 'Make sure your face is well lit'}
          </Text>
        </View>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => onContinue && onContinue({ photoVerified: true })}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>
              {captured ? 'Continue →' : 'Continue'}
            </Text>
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
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  header: {
    marginBottom: 10,
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
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  ringOffset: {
    padding: 6,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.35)',
    borderStyle: 'dashed',
  },
  dashedRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.50)',
    ...SHADOWS.md,
  },
  faceCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarMockup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 90,
  },
  capturedBadge: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capturedCheck: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  shutterSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  shutterBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...SHADOWS.buttonGlow,
  },
  cameraIcon: {
    fontSize: 26,
  },
  lightingHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5f7da6',
    textAlign: 'center',
  },
  footer: {
    paddingTop: 8,
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
