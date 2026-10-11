import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

// Vector Icon components built with pure React Native Views for crisp rendering on all Android/iOS displays
function HomeIcon({ color }) {
  return (
    <View style={styles.iconWrapper}>
      {/* Roof */}
      <View style={[styles.roofTriangle, { borderBottomColor: color }]} />
      {/* House Body */}
      <View style={[styles.houseBody, { backgroundColor: color }]}>
        {/* Door Notch */}
        <View style={styles.doorNotch} />
      </View>
    </View>
  );
}

function JobsIcon({ color }) {
  return (
    <View style={styles.iconWrapper}>
      {/* Handle */}
      <View style={[styles.briefcaseHandle, { borderColor: color }]} />
      {/* Case */}
      <View style={[styles.briefcaseBody, { borderColor: color }]}>
        <View style={[styles.briefcaseStrap, { backgroundColor: color }]} />
        <View style={[styles.briefcaseLatch, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function BookingsIcon({ color }) {
  return (
    <View style={styles.iconWrapper}>
      {/* Clipboard Clip */}
      <View style={[styles.clipboardClip, { borderColor: color }]} />
      {/* Board Body */}
      <View style={[styles.clipboardBody, { borderColor: color }]}>
        <View style={[styles.clipboardLine, { backgroundColor: color, width: 11, top: 3.5 }]} />
        <View style={[styles.clipboardLine, { backgroundColor: color, width: 8.5, top: 7 }]} />
        <View style={[styles.clipboardLine, { backgroundColor: color, width: 6, top: 10.5 }]} />
      </View>
    </View>
  );
}

function WalletIcon({ color }) {
  return (
    <View style={styles.iconWrapper}>
      {/* Wallet Body */}
      <View style={[styles.walletBody, { borderColor: color }]}>
        {/* Top fold line */}
        <View style={[styles.walletTopLine, { backgroundColor: color }]} />
        {/* Clasp / Flap */}
        <View style={[styles.walletClasp, { borderColor: color }]}>
          <View style={[styles.claspDot, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

function ProfileIcon({ color }) {
  return (
    <View style={styles.iconWrapper}>
      {/* Head */}
      <View style={[styles.profileHead, { borderColor: color }]} />
      {/* Shoulders */}
      <View style={[styles.profileShoulders, { borderColor: color }]} />
    </View>
  );
}

const DEFAULT_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'trades', label: 'Trades' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'profile', label: 'Profile' }
];

export default function GlassFloatingBottomNav({
  items = DEFAULT_ITEMS,
  activeId = 'home',
  onSelect,
  centerType = 'book',
  isOnline = false,
  onToggleDuty,
  style
}) {
  const { theme } = useTheme();

  // Pulse Glow Animation for Center Button
  const glowAnim = useRef(new Animated.Value(0)).current;
  const isDutyMode = centerType === 'duty';

  useEffect(() => {
    if (isDutyMode && !isOnline) {
      glowAnim.setValue(0);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true
        })
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim, isDutyMode, isOnline]);

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.28]
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 0.05]
  });

  const glowScaleOuter = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 1.48]
  });

  const glowOpacityOuter = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0]
  });

  const isDark = (theme.backgroundPrimary && theme.backgroundPrimary.startsWith('#0'));

  const activeColor = isDark ? '#FF8C42' : '#0B2341';
  const inactiveColor = isDark ? '#94A3B8' : '#5A738E';
  const activeBgCircle = isDark ? 'rgba(255, 140, 66, 0.25)' : '#FFE4D0';

  const renderIcon = (id, isActive) => {
    const color = isActive ? (isDark ? '#FF8C42' : '#0B2341') : inactiveColor;
    switch (id) {
      case 'home':
        return <HomeIcon color={color} />;
      case 'jobs':
      case 'works':
      case 'workers':
      case 'trades':
        return <JobsIcon color={color} />;
      case 'bookings':
      case 'orders':
      case 'history':
        return <BookingsIcon color={color} />;
      case 'wallet':
      case 'earnings':
        return <WalletIcon color={color} />;
      case 'profile':
      case 'support':
      default:
        return <ProfileIcon color={color} />;
    }
  };

  const renderNavItem = (item) => {
    const isTradeItem = item.id === 'trades' || item.id === 'jobs' || item.id === 'works' || item.id === 'workers';
    const isTradeActive = activeId === 'trades' || activeId === 'jobs' || activeId === 'works' || activeId === 'workers';
    const isBookingItem = item.id === 'bookings' || item.id === 'orders' || item.id === 'history';
    const isBookingActive = activeId === 'bookings' || activeId === 'orders' || activeId === 'history' || activeId === 'tracking';
    const isActive = item.id === activeId || (isTradeItem && isTradeActive) || (isBookingItem && isBookingActive);
    const textColor = isActive ? activeColor : inactiveColor;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.navItem}
        onPress={() => onSelect && onSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, isActive && [styles.activeCircle, { backgroundColor: activeBgCircle }]]}>
          {renderIcon(item.id, isActive)}
        </View>
        <Text
          style={[
            styles.navLabel,
            {
              color: textColor,
              fontWeight: isActive ? '800' : '600'
            }
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2);

  // Center button dynamic appearance (On Duty/Off Duty Switch in Partner App, Book in Customer App)
  let centerBgColor;
  let centerBorderColor;
  let centerGlowInner;
  let centerGlowOuter;
  let centerIcon;
  let centerLabel;

  if (isDutyMode) {
    if (isOnline) {
      centerBgColor = '#16A34A';
      centerBorderColor = '#4ADE80';
      centerGlowInner = 'rgba(34, 197, 94, 0.45)';
      centerGlowOuter = 'rgba(34, 197, 94, 0.25)';
      centerIcon = '🟢';
      centerLabel = 'ON DUTY';
    } else {
      centerBgColor = isDark ? '#1E293B' : '#475569';
      centerBorderColor = isDark ? '#334155' : '#64748B';
      centerGlowInner = 'transparent';
      centerGlowOuter = 'transparent';
      centerIcon = '⚪';
      centerLabel = 'OFF DUTY';
    }
  } else {
    centerBgColor = isDark ? '#FF6B00' : '#0B2341';
    centerBorderColor = isDark ? '#FFA04D' : '#173F6B';
    centerGlowInner = isDark ? 'rgba(255, 107, 0, 0.45)' : 'rgba(23, 63, 107, 0.32)';
    centerGlowOuter = isDark ? 'rgba(255, 107, 0, 0.30)' : 'rgba(23, 63, 107, 0.20)';
    centerIcon = '⚡';
    centerLabel = 'Book';
  }

  const handleCenterPress = () => {
    if (isDutyMode) {
      if (onToggleDuty) {
        onToggleDuty();
      } else if (onSelect) {
        onSelect('duty');
      }
    } else {
      if (onSelect) {
        onSelect('book');
      }
    }
  };

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: isDark ? 'rgba(20, 30, 48, 0.94)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.30)' : 'rgba(255, 255, 255, 0.95)'
        },
        style
      ]}
    >
      {/* Left Wing (Home, Trades) */}
      <View style={styles.wingGroup}>
        {leftItems.map(renderNavItem)}
      </View>

      {/* Center Animated Glowing Button (On Duty/Off Duty Switch in Partner App, Book in Customer App) */}
      <TouchableOpacity
        style={styles.centerFabContainer}
        onPress={handleCenterPress}
        activeOpacity={0.82}
      >
        {/* Glow Ring Outer */}
        <Animated.View
          style={[
            styles.glowRingOuter,
            {
              backgroundColor: centerGlowOuter,
              transform: [{ scale: glowScaleOuter }],
              opacity: (isDutyMode && !isOnline) ? 0 : glowOpacityOuter
            }
          ]}
        />

        {/* Glow Ring Inner */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              backgroundColor: centerGlowInner,
              transform: [{ scale: glowScale }],
              opacity: (isDutyMode && !isOnline) ? 0 : glowOpacity
            }
          ]}
        />

        {/* Floating Capsule FAB */}
        <View
          style={[
            styles.centerFab,
            {
              backgroundColor: centerBgColor,
              borderColor: centerBorderColor
            }
          ]}
        >
          <Text style={[styles.flashEmoji, isDutyMode && styles.dutyEmoji]}>{centerIcon}</Text>
          <Text style={[styles.fabLabel, isDutyMode && styles.dutyFabLabel]}>{centerLabel}</Text>
        </View>
      </TouchableOpacity>

      {/* Right Wing (Bookings, Profile) */}
      <View style={styles.wingGroup}>
        {rightItems.map(renderNavItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16
  },
  wingGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%'
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%'
  },
  iconBox: {
    width: 38,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2
  },
  activeCircle: {
    width: 42,
    height: 38,
    borderRadius: 19
  },
  iconWrapper: {
    width: 28,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  navLabel: {
    fontSize: 10.5,
    letterSpacing: -0.2
  },

  // Center Flash Glowing Button
  centerFabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 72,
    marginTop: -20,
    zIndex: 20
  },
  glowRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27
  },
  glowRingOuter: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34
  },
  centerFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  flashEmoji: {
    fontSize: 20,
    lineHeight: 22,
    marginBottom: -1
  },
  dutyEmoji: {
    fontSize: 15,
    lineHeight: 18,
    marginBottom: 1
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.2
  },
  dutyFabLabel: {
    fontSize: 8,
    letterSpacing: 0.3
  },

  // Home Icon
  roofTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: -1
  },
  houseBody: {
    width: 14,
    height: 9,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  doorNotch: {
    width: 4,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  // Jobs (Briefcase) Icon
  briefcaseHandle: {
    width: 8,
    height: 3.5,
    borderTopWidth: 1.8,
    borderLeftWidth: 1.8,
    borderRightWidth: 1.8,
    borderTopLeftRadius: 2.5,
    borderTopRightRadius: 2.5,
    marginBottom: 1
  },
  briefcaseBody: {
    width: 20,
    height: 14,
    borderWidth: 1.8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  briefcaseStrap: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 1.2
  },
  briefcaseLatch: {
    position: 'absolute',
    top: 4,
    width: 4,
    height: 3,
    borderRadius: 1
  },
  // Bookings / Clipboard Icon
  clipboardClip: {
    width: 8,
    height: 3,
    borderWidth: 1.6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomWidth: 0,
    marginBottom: -1,
    zIndex: 2
  },
  clipboardBody: {
    width: 18,
    height: 16,
    borderWidth: 1.8,
    borderRadius: 3.5,
    alignItems: 'center',
    position: 'relative'
  },
  clipboardLine: {
    position: 'absolute',
    left: 3,
    height: 1.4,
    borderRadius: 1
  },
  // Wallet Icon
  walletBody: {
    width: 20,
    height: 15,
    borderWidth: 1.8,
    borderRadius: 4,
    justifyContent: 'center',
    position: 'relative'
  },
  walletTopLine: {
    position: 'absolute',
    top: 3.5,
    left: 2.5,
    right: 2.5,
    height: 1,
    opacity: 0.6
  },
  walletClasp: {
    position: 'absolute',
    right: -2,
    width: 7,
    height: 7,
    borderWidth: 1.8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  claspDot: {
    width: 2,
    height: 2,
    borderRadius: 1
  },
  // Profile Icon
  profileHead: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.8,
    marginBottom: 1.5
  },
  profileShoulders: {
    width: 18,
    height: 7.5,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.8,
    borderBottomWidth: 0
  }
});
