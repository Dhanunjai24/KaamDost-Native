import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function SplashScreen({ onFinish }) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Spinner loop
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      {/* Ambient background glows */}
      <View style={styles.ambientTopGlow} />
      <View style={styles.ambientBottomGlow} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Rounded Frosted Card holding the official logo */}
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/01_main_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text style={styles.brandTitle}>Kaam<Text style={styles.brandAccent}>Dost</Text></Text>
        <Text style={styles.tagline}>Trusted Help, Better Living</Text>
        <Text style={styles.subTagline}>Your Work. Our Dost.</Text>

        {/* Circular Loading Ring matching screen_01 */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={[
              styles.spinnerRing,
              { transform: [{ rotate: spin }] },
            ]}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientTopGlow: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(59, 130, 246, 0.45)',
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(37, 99, 235, 0.5)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoCard: {
    width: 140,
    height: 140,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginBottom: 26,
    ...SHADOWS.large,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#fed7aa',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0f2fe',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  subTagline: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    marginTop: 60,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderTopColor: '#ffffff',
    borderRightColor: '#93c5fd',
  },
});
