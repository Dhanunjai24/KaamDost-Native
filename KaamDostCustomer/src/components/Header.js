import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function Header({
  city = 'Sangareddy',
  onSelectCity,
  onOpenLanguage,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 2
}) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Brand and Location */}
        <View style={styles.brandCol}>
          <Text style={styles.brandTitle}>
            Kaam<Text style={styles.brandAccent}>Dost</Text>
          </Text>
          <TouchableOpacity
            style={styles.locationPill}
            onPress={onSelectCity}
            activeOpacity={0.7}
          >
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText} numberOfLines={1}>{city}, Telangana</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Action icons: Language, Notification, Profile */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🌐</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={onOpenProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surface,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small
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
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: -0.5
  },
  brandAccent: {
    color: COLORS.primary
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
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
    fontWeight: '600',
    color: COLORS.primaryDark,
    maxWidth: 140
  },
  chevron: {
    fontSize: 11,
    color: COLORS.primaryDark,
    marginLeft: 3
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative'
  },
  iconText: {
    fontSize: 16
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700'
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 16
  }
});
