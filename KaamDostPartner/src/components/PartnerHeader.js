import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';

export default function PartnerHeader({
  partnerName = 'RAJU KUMAR',
  rating = '4.9',
  isOnline = true,
  onToggleDuty,
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
            <View style={[styles.avatarCircle, { backgroundColor: '#1E293B', borderColor: 'rgba(255, 255, 255, 0.25)' }]}>
              {/* Photo representation with worker avatar */}
              <Text style={styles.avatarEmoji}>👷🏾‍♂️</Text>
            </View>
            {/* Duty Active Indicator Dot */}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? '#22C55E' : '#64748B' }
              ]}
            />
          </View>

          <View style={styles.nameAndRating}>
            <Text style={[styles.workerName, { color: '#FFFFFF' }]} numberOfLines={1}>
              {partnerName.toUpperCase()}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>{rating}</Text>
              <Text style={styles.starIcon}>★</Text>
            </View>
          </View>
        </View>

        {/* Right Controls: Duty Switch & Telugu Badge */}
        <View style={styles.rightControls}>
          {/* Duty Switch Pill */}
          <TouchableOpacity
            style={[
              styles.dutySwitchTrack,
              {
                backgroundColor: isOnline ? '#22C55E' : '#334155'
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
                  backgroundColor: '#FF6B00'
                }
              ]}
            />
          </TouchableOpacity>

          {/* Language Pill Badge */}
          <TouchableOpacity
            style={[
              styles.langPill,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.18)'
              }
            ]}
            onPress={toggleLanguage}
            activeOpacity={0.75}
          >
            <Text style={styles.langText}>{currentLang}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Duty Status Subtitle */}
      <View style={styles.dutyStatusRow}>
        <Text style={styles.dutyLabel}>
          Duty:{' '}
          <Text style={{ color: isOnline ? '#22C55E' : '#94A3B8', fontWeight: '800' }}>
            {isOnline ? 'ACTIVE 🟢' : 'OFFLINE ⚪'}
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
    borderWidth: 2,
    borderColor: '#0B1320'
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
    color: '#CBD5E1',
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
    gap: 10
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  langText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600'
  },
  dutyStatusRow: {
    marginTop: 6,
    paddingLeft: 62
  },
  dutyLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  }
});
