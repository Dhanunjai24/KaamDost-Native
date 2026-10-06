import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

// Vector Icon components built with pure React Native Views for crisp rendering on all Android/iOS displays
function HomeIcon({ active, color }) {
  return (
    <View style={styles.iconWrapper}>
      {active && (
        <View style={styles.glowAura} />
      )}
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

function JobsIcon({ active, color }) {
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

function WalletIcon({ active, color }) {
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

function ProfileIcon({ active, color }) {
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
  { id: 'jobs', label: 'Jobs' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'profile', label: 'Profile' }
];

export default function GlassFloatingBottomNav({
  items = DEFAULT_ITEMS,
  activeId = 'home',
  onSelect,
  style
}) {
  const { theme } = useTheme();

  const isDark = theme.id === 'slate_orange' || (theme.backgroundPrimary && theme.backgroundPrimary.startsWith('#0'));

  const activeColor = theme.accentPrimary || '#FF6B00';
  const inactiveColor = isDark ? '#94A3B8' : '#64748B';

  const renderIcon = (id, isActive) => {
    const color = isActive ? activeColor : inactiveColor;
    switch (id) {
      case 'home':
        return <HomeIcon active={isActive} color={color} />;
      case 'jobs':
      case 'workers':
        return <JobsIcon active={isActive} color={color} />;
      case 'wallet':
      case 'earnings':
        return <WalletIcon active={isActive} color={color} />;
      case 'profile':
      case 'support':
      default:
        return <ProfileIcon active={isActive} color={color} />;
    }
  };

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: isDark ? 'rgba(20, 30, 48, 0.88)' : 'rgba(255, 255, 255, 0.90)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.08)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.95)'
        },
        style
      ]}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const color = isActive ? activeColor : inactiveColor;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onSelect && onSelect(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconBox}>
              {renderIcon(item.id, isActive)}
            </View>
            <Text
              style={[
                styles.navLabel,
                {
                  color: color,
                  fontWeight: isActive ? '700' : '500'
                }
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 36,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    elevation: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%'
  },
  iconBox: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2
  },
  iconWrapper: {
    width: 32,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  navLabel: {
    fontSize: 11,
    letterSpacing: -0.2
  },
  // Home Icon
  glowAura: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 107, 0, 0.30)',
    top: -4
  },
  roofTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: -1
  },
  houseBody: {
    width: 15,
    height: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  doorNotch: {
    width: 4,
    height: 5.5,
    backgroundColor: '#0B1320',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  // Jobs (Briefcase) Icon
  briefcaseHandle: {
    width: 9,
    height: 4,
    borderTopWidth: 1.8,
    borderLeftWidth: 1.8,
    borderRightWidth: 1.8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 1
  },
  briefcaseBody: {
    width: 22,
    height: 15,
    borderWidth: 1.8,
    borderRadius: 4.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  briefcaseStrap: {
    position: 'absolute',
    top: 5.5,
    left: 0,
    right: 0,
    height: 1.2
  },
  briefcaseLatch: {
    position: 'absolute',
    top: 4.5,
    width: 4.5,
    height: 3,
    borderRadius: 1
  },
  // Wallet Icon
  walletBody: {
    width: 22,
    height: 16,
    borderWidth: 1.8,
    borderRadius: 4.5,
    justifyContent: 'center',
    position: 'relative'
  },
  walletTopLine: {
    position: 'absolute',
    top: 4,
    left: 3,
    right: 3,
    height: 1,
    opacity: 0.6
  },
  walletClasp: {
    position: 'absolute',
    right: -2,
    width: 7.5,
    height: 7.5,
    borderWidth: 1.8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  claspDot: {
    width: 2.2,
    height: 2.2,
    borderRadius: 1.1
  },
  // Profile Icon
  profileHead: {
    width: 9.5,
    height: 9.5,
    borderRadius: 5,
    borderWidth: 1.8,
    marginBottom: 2
  },
  profileShoulders: {
    width: 19,
    height: 8.5,
    borderTopLeftRadius: 9.5,
    borderTopRightRadius: 9.5,
    borderWidth: 1.8,
    borderBottomWidth: 0
  }
});
