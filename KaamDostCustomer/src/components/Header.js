import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';
import { t } from '../../../shared/i18n';

export default function Header({
  city = 'Sangareddy',
  onSelectCity,
  onOpenLanguage,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 2
}) {
  const { theme, shadows } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderBottomColor: theme.border
        },
        shadows.small
      ]}
    >
      <View style={styles.topRow}>
        {/* Brand and Location */}
        <View style={styles.brandCol}>
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
            Kaam<Text style={{ color: theme.accentPrimary }}>Dost</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.locationPill,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.border,
                borderWidth: 1
              }
            ]}
            onPress={onSelectCity}
            activeOpacity={0.7}
          >
            <Text style={styles.locationPin}>📍</Text>
            <Text
              style={[styles.locationText, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {city}, Telangana
            </Text>
            <Text style={[styles.chevron, { color: theme.textSecondary }]}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Action icons: Theme Switcher, Language, Notification, Profile */}
        <View style={styles.actionsRow}>
          {/* Theme Palette Switcher Button */}
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

          {/* Language Selector */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: theme.glassSurface,
                borderColor: theme.border
              }
            ]}
            onPress={onOpenLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🌐</Text>
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
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.buttonPrimary }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Profile */}
          <TouchableOpacity
            style={[
              styles.avatarBtn,
              {
                backgroundColor: theme.buttonPrimary
              }
            ]}
            onPress={onOpenProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Switcher Modal */}
      <ThemeSwitcherModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.2
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandCol: {
    flex: 1
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 130
  },
  chevron: {
    fontSize: 11,
    marginLeft: 3
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative'
  },
  iconText: {
    fontSize: 16
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 16
  }
});
