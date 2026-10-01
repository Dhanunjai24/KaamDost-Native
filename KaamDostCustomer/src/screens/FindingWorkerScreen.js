import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function FindingWorkerScreen({ onBack, onWorkerFound }) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      if (onWorkerFound) onWorkerFound();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const checkItems = [
    'Checking nearby workers',
    'Verifying availability',
    'Matching skills & rating',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_17 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.mainHeading}>Finding the best worker for you...</Text>

          {/* Animated Spinner Ring matching screen_17 */}
          <View style={styles.spinnerContainer}>
            <Animated.View
              style={[
                styles.spinnerRing,
                { transform: [{ rotate: spin }] },
              ]}
            />
          </View>

          {/* Status Checklist matching screen_17 */}
          <View style={styles.checklist}>
            {checkItems.map((item, index) => (
              <View key={index} style={styles.checkRow}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Worker Graphic / Avatar matching screen_17 */}
          <View style={styles.workerGraphicBox}>
            <View style={styles.workerAvatarCircle}>
              <Text style={styles.workerEmoji}>👨‍🔧</Text>
            </View>
            <Text style={styles.workerTag}>Verified Professional</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={onWorkerFound}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>View Assigned Worker →</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
    textAlign: 'center',
    marginBottom: 26,
  },
  spinnerContainer: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  spinnerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#dbeafe',
    borderTopColor: '#2563eb',
    borderRightColor: '#60a5fa',
  },
  checklist: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    gap: 16,
    ...SHADOWS.small,
    marginBottom: 24,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  checkMark: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f294a',
  },
  workerGraphicBox: {
    alignItems: 'center',
  },
  workerAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    ...SHADOWS.small,
  },
  workerEmoji: {
    fontSize: 38,
  },
  workerTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 8,
  },
  footer: {
    paddingTop: 10,
  },
  continueBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
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
