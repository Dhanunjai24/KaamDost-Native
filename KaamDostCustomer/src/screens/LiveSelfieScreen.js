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
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
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

        {/* Circular Face Viewfinder matching screen_07 */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.outerRing}>
            <View style={styles.progressTickTop} />
            <View style={styles.progressTickRight} />
            <View style={styles.progressTickBottom} />
            <View style={styles.progressTickLeft} />

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

        {/* Shutter Camera Button matching screen_07 */}
        <View style={styles.shutterContainer}>
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

        {/* Skip / Continue fallback */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => onContinue && onContinue({ photoVerified: true })}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>
              {captured ? 'Proceed →' : 'Use Existing Photo / Continue'}
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
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  header: {
    marginBottom: 20,
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
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    ...SHADOWS.large,
  },
  progressTickTop: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  progressTickRight: {
    position: 'absolute',
    right: -5,
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  progressTickBottom: {
    position: 'absolute',
    bottom: -5,
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  progressTickLeft: {
    position: 'absolute',
    left: -5,
    width: 6,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  faceCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
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
    bottom: 12,
    backgroundColor: '#10b981',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  capturedCheck: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  shutterContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#dbeafe',
    ...SHADOWS.buttonGlow,
    marginBottom: 14,
  },
  cameraIcon: {
    fontSize: 28,
  },
  lightingHint: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  footer: {
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  continueBtnText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
  },
});
