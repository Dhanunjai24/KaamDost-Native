import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';

export default function PartnerHeader({
  partnerName = 'Ramesh Reddy',
  trade = 'Mason',
  isOnline = true,
  onToggleDuty,
  onOpenNotifications,
  onOpenEarnings
}) {
  const { theme, shadows } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderBottomColor: theme.border
        },
        shadows.small
      ]}
    >
      <View style={styles.leftCol}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
            Kaam<Text style={{ color: theme.accentPrimary }}>Dost</Text>
          </Text>
          <View style={[styles.partnerBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.partnerBadgeText, { color: theme.textPrimary }]}>
              PARTNER
            </Text>
          </View>
        </View>

        <Text style={[styles.partnerInfo, { color: theme.textSecondary }]}>
          👷 {partnerName} • <Text style={[styles.tradeText, { color: theme.accentPrimary }]}>{trade}</Text>
        </Text>
      </View>

      <View style={styles.rightCol}>
        {/* Theme Palette Switcher */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: theme.glassSurface,
              borderColor: theme.border
            }
          ]}
          onPress={() => setShowThemeModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🎨</Text>
        </TouchableOpacity>

        {/* Duty Status Badge / Toggle */}
        <TouchableOpacity
          style={[
            styles.dutyPill,
            {
              backgroundColor: isOnline ? theme.successLight : theme.glassSurface,
              borderColor: isOnline ? theme.success : theme.border
            }
          ]}
          onPress={onToggleDuty}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isOnline ? theme.success : theme.textMuted }
            ]}
          />
          <Text
            style={[
              styles.dutyText,
              { color: isOnline ? theme.success : theme.textMuted }
            ]}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: theme.glassSurface,
              borderColor: theme.border
            }
          ]}
          onPress={onOpenNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ThemeSwitcherModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.2
  },
  leftCol: {
    flex: 1
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  partnerBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  partnerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  partnerInfo: {
    fontSize: 12,
    marginTop: 4
  },
  tradeText: {
    fontWeight: '800'
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dutyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.2
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  dutyText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  iconText: {
    fontSize: 16
  }
});
