import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function GlassProfileCard({
  name = 'Ravi Kumar',
  phone = '9876543210',
  city = 'Sangareddy',
  isVerified = true,
  avatarEmoji = '👤',
  onPressEdit,
  style
}) {
  const { theme, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glassSurfaceStrong,
          borderColor: theme.border
        },
        shadows.glass,
        style
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.avatarContainer,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
        >
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{name}</Text>
          <Text style={[styles.phone, { color: theme.textSecondary }]}>
            +91 {phone} • {city}
          </Text>

          {isVerified ? (
            <View style={[styles.verifiedBadge, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.verifiedText, { color: theme.success }]}>
                ✓ 100% UIDAI Verified Citizen
              </Text>
            </View>
          ) : (
            <View style={[styles.verifiedBadge, { backgroundColor: theme.warningLight }]}>
              <Text style={[styles.verifiedText, { color: theme.warning }]}>
                ⏳ Verification Pending
              </Text>
            </View>
          )}
        </View>

        {onPressEdit ? (
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: theme.primaryLight }]}
            onPress={onPressEdit}
            activeOpacity={0.7}
          >
            <Text style={[styles.editIcon, { color: theme.textPrimary }]}>✎</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 16,
    marginVertical: 6
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarEmoji: {
    fontSize: 26
  },
  infoCol: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  phone: {
    fontSize: 12,
    marginTop: 2
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700'
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  editIcon: {
    fontSize: 14,
    fontWeight: '700'
  }
});
