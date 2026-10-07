import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';

export default function PartnerHeader({
  partnerName = 'RAJU KUMAR',
  rating = '4.9',
  isOnline = true,
  onToggleDuty,
  onOpenNotifications,
  onOpenEarnings,
  onOpenSos
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

        {/* Right Controls: Duty Switch, Theme Palette & Telugu Badge */}
        <View style={styles.rightControls}>
          {/* Duty Switch Pill */}
          <TouchableOpacity
            style={[
              styles.dutySwitchTrack,
              {
                backgroundColor: isOnline ? '#22C55E' : (theme.isDark ? '#334155' : '#CBD5E1')
              }
            ]}
            onPress={onToggleDuty}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.dutySwitchThumb,
                {
                  alignSelf: isOnline ? 'flex-end' : 'flex-start',
                  backgroundColor: theme.accentPrimary || '#FF6B00'
                }
              ]}
            />
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
          {/* SOS Emergency Button */}
          {onOpenSos && (
            <TouchableOpacity
              style={[
                styles.langPill,
                {
                  backgroundColor: '#fee2e2',
                  borderColor: '#fca5a5',
                  paddingHorizontal: 8
                }
              ]}
              onPress={onOpenSos}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 13 }}>🚨</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Duty Status Subtitle */}
      <View style={styles.dutyStatusRow}>
        <Text style={[styles.dutyLabel, { color: theme.textSecondary }]}>
          Duty:{' '}
          <Text style={{ color: isOnline ? '#22C55E' : (theme.isDark ? '#94A3B8' : '#64748B'), fontWeight: '800' }}>
            {isOnline ? 'ACTIVE 🟢' : 'OFFLINE ⚪'}
          </Text>
        </Text>
      </View>
          </Text>
        </Text>
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
  dutySwitchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center'
  },
  dutySwitchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    elevation: 2
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
  dutyStatusRow: {
    marginTop: 6,
    paddingLeft: 62
  },
  dutyLabel: {
    fontSize: 11,
    fontWeight: '600'
  }
});
