import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function BottomTabBar({ activeTab = 'Home', onTabPress }) {
  const tabs = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Services', label: 'Services', icon: '🛠️' },
    { id: 'Bookings', label: 'Bookings', icon: '📋' },
    { id: 'Wallet', label: 'Wallet', icon: '👛' },
    { id: 'Profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab?.toLowerCase() === tab.id.toLowerCase();
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => onTabPress && onTabPress(tab.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  container: {
    height: 66,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    ...SHADOWS.md,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.55,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5f7da6',
  },
  tabLabelActive: {
    color: '#2563eb',
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563eb',
    marginTop: 2,
  },
});
