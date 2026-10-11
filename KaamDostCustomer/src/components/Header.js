import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeContext';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';
import { useResponsive } from '../utils/responsive';
import { t } from '../../../shared/i18n';

export default function Header({
  customer,
  city = 'Telangana',
  walletBalance = 0,
  onSelectCity,
  onEditAddress,
  onOpenWallet,
  onOpenLanguage,
  onOpenNotifications,
  onOpenProfile,
onOpenSos,
  onOpenAdmin,
  unreadCount = 0
}) {
  const { theme, shadows } = useTheme();
  const { isSmallScreen, fontSize } = useResponsive();
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Format real customer address & choose icon
  const addr = customer?.address;
  let addressTypeIcon = '📍';
  let displayAddress = 'Add Address';

  if (addr) {
    if (typeof addr === 'string') {
      displayAddress = addr;
    } else {
      const type = addr.addressType || addr.type;
      if (type === 'Home') addressTypeIcon = '🏠';
      else if (type === 'Work') addressTypeIcon = '💼';
      else if (type === 'Site') addressTypeIcon = '🏗️';
      else addressTypeIcon = '📍';

      const streetOrArea = addr.street || addr.houseNo || addr.landmark;
      const cityOrMandal = addr.city;
      const pincode = addr.pincode;

      if (streetOrArea && cityOrMandal) {
        displayAddress = `${streetOrArea}, ${cityOrMandal}`;
      } else if (streetOrArea) {
        displayAddress = streetOrArea;
      } else if (cityOrMandal) {
        displayAddress = pincode ? `${cityOrMandal}, ${pincode}` : cityOrMandal;
      } else if (pincode) {
        displayAddress = `Pin: ${pincode}`;
      } else {
        displayAddress = type ? `${type} Address` : 'My Address';
      }
    }
  } else if (city && city !== 'Telangana') {
    displayAddress = city;
  }

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
        {/* Left Side: Profile Button + Brand and Location */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={[
              styles.avatarBtn,
              {
                backgroundColor: theme.buttonPrimary,
                marginRight: 10
              }
            ]}
            onPress={onOpenProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>

          <View style={styles.brandCol}>
            <Text
              style={[
                styles.brandTitle,
                { color: theme.textPrimary, fontSize: isSmallScreen ? 19 : 22 }
              ]}
            >
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
              onPress={onEditAddress || onSelectCity}
              activeOpacity={0.7}
            >
              <Text style={styles.locationPin}>{addressTypeIcon}</Text>
              <Text
                style={[
                  styles.locationText,
                  {
                    color: theme.textPrimary,
                    maxWidth: isSmallScreen ? 110 : 155,
                    fontSize: isSmallScreen ? 11 : 12
                  }
                ]}
                numberOfLines={1}
              >
                {displayAddress}
              </Text>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>▾</Text>
            </TouchableOpacity>
          </View>
        </View>

{/* Action icons: SOS, Admin, Theme Switcher, Language, Notification */}
          <View style={styles.actionsRow}>
            {onOpenSos && (
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: '#fee2e2', borderColor: '#fca5a5' }]}
                onPress={onOpenSos}
                activeOpacity={0.7}
              >
                <Text style={styles.iconText}>🚨</Text>
              </TouchableOpacity>
            )}
            {onOpenAdmin && (
              <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }]}
                onPress={onOpenAdmin}
                activeOpacity={0.7}
              >
                <Text style={styles.iconText}>⚙️</Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity
            style={[
              styles.walletBtn,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.border
              }
            ]}
            onPress={onOpenWallet}
            activeOpacity={0.7}
          >
            <Text style={styles.walletIcon}>👛</Text>
            <Text style={[styles.walletAmount, { color: theme.textPrimary }]}>
              ₹{walletBalance}
            </Text>
          </TouchableOpacity>


          {/* Notifications */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: 'transparent',
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
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
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
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4
  },
  walletIcon: {
    fontSize: 13
  },
  walletAmount: {
    fontSize: 12,
    fontWeight: '800'
  }
});
