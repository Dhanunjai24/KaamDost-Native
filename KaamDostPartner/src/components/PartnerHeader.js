import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';

export default function PartnerHeader({
  partnerName = 'PARTNER',
  rating = '--',
  isOnline = true,
  unreadCount = 0,
  onOpenNotifications,
  onOpenEarnings
}) {
  const { theme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('తెలుగు');

  const toggleLanguage = () => {
    setCurrentLang(prev => (prev === 'తెలుగు' ? 'English' : 'తెలుగు'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Worker Avatar & Identity */}
        <View style={styles.workerIdentity}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarCircle,
                {
                  backgroundColor: theme.isDark ? '#1E293B' : theme.glassSurfaceStrong,
                  borderColor: theme.border
                }
              ]}
            >
              {/* Photo representation with worker avatar */}
              <Text style={styles.avatarEmoji}>👷🏾‍♂️</Text>
            </View>
            {/* Duty Active Indicator Dot */}
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOnline ? '#22C55E' : '#64748B',
                  borderColor: theme.backgroundPrimary
                }
              ]}
            />
          </View>

          <View style={styles.nameAndRating}>
            <Text style={[styles.workerName, { color: theme.textPrimary }]} numberOfLines={1}>
              {partnerName.toUpperCase()}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{rating}</Text>
              <Text style={styles.starIcon}>★</Text>
            </View>
          </View>
        </View>

        {/* Right Controls: Notifications Bell, Theme Palette & Telugu Badge */}
        <View style={styles.rightControls}>
          {/* Notifications Bell */}
          <TouchableOpacity
            style={[
              styles.langPill,
              {
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.glassSurface,
                borderColor: theme.border,
                position: 'relative',
                paddingHorizontal: 9
              }
            ]}
            onPress={onOpenNotifications}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 13 }}>🔔</Text>
            {unreadCount > 0 && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.accentPrimary || '#EF4444' }
                ]}
              >
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Theme Switcher Button */}
          <TouchableOpacity
            style={[
              styles.langPill,
              {
                backgroundColor: theme.primaryLight || 'rgba(255, 107, 0, 0.15)',
                borderColor: theme.accentPrimary || 'rgba(255, 107, 0, 0.4)',
                paddingHorizontal: 8
              }
            ]}
            onPress={() => setShowThemeModal(true)}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 13 }}>🎨</Text>
          </TouchableOpacity>

          {/* Language Pill Badge */}
          <TouchableOpacity
            style={[
              styles.langPill,
              {
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme.glassSurface,
                borderColor: theme.border
              }
            ]}
            onPress={toggleLanguage}
            activeOpacity={0.75}
          >
            <Text style={[styles.langText, { color: theme.textPrimary }]}>{currentLang}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ThemeSwitcherModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 20
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  workerIdentity: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarEmoji: {
    fontSize: 28
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2
  },
  nameAndRating: {
    justifyContent: 'center'
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 3
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 14
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  langText: {
    fontSize: 12,
    fontWeight: '600'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});
