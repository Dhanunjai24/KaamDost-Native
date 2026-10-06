import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import GlassModal from './GlassModal';

export default function ThemeSwitcherModal({ visible, onClose }) {
  const { theme, themeId, switchTheme, THEMES } = useTheme();

  const themesList = [
    {
      id: 'light_navy',
      name: 'Theme 1: Light + Navy Blue',
      badge: 'DEFAULT',
      description: 'Cool light background with deep royal navy typography and accents.',
      bgSample: '#F4F8FC',
      primarySample: '#0B2341'
    },
    {
      id: 'white_teal',
      name: 'Theme 2: White + Deep Teal',
      badge: 'MINT & TEAL',
      description: 'Fresh crisp white background with authoritative deep teal typography.',
      bgSample: '#F6FBFA',
      primarySample: '#073B3A'
    },
        {
      id: 'ivory_indigo',
      name: 'Theme 3: Soft Ivory + Deep Indigo',
      badge: 'PREMIUM',
      description: 'Warm soft ivory background with sophisticated deep indigo typography.',
      bgSample: '#FAF9F6',
      primarySample: '#25234A'
    },
    {
      id: 'slate_orange',
      name: 'Theme 4: Dark Slate + Saffron Orange',
      badge: 'PARTNER PRO',
      description: 'Ultra-modern dark slate glass with high-visibility saffron orange accents.',
      bgSample: '#0B1320',
      primarySample: '#FF6B00'
    }
  ];

  return (
    <GlassModal
      visible={visible}
      onClose={onClose}
      title="Choose Theme"
      subtitle="Select a global 2-color glassmorphic appearance"
    >
      <View style={styles.list}>
        {themesList.map((item) => {
          const isSelected = item.id === themeId;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.themeCard,
                {
                  backgroundColor: isSelected ? theme.primaryLight : theme.glassSurface,
                  borderColor: isSelected ? theme.accentPrimary : theme.border
                }
              ]}
              onPress={() => {
                switchTheme(item.id);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                {/* Dual Color Swatches */}
                <View style={styles.swatchWrapper}>
                  <View
                    style={[
                      styles.swatchBg,
                      {
                        backgroundColor: item.bgSample,
                        borderColor: item.primarySample,
                        borderWidth: 1.5
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.swatchPrimary,
                        { backgroundColor: item.primarySample }
                      ]}
                    />
                  </View>
                </View>

                {/* Details */}
                <View style={styles.infoCol}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[
                        styles.themeName,
                        { color: isSelected ? theme.textPrimary : theme.textPrimary }
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <Text
                    style={[styles.themeDesc, { color: theme.textSecondary }]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>

                {/* Active Checkmark */}
                <View style={styles.checkWrapper}>
                  {isSelected ? (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: theme.accentPrimary }
                      ]}
                    >
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.uncheckCircle,
                        { borderColor: theme.borderStrong }
                      ]}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 4
  },
  themeCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  swatchWrapper: {
    marginRight: 12
  },
  swatchBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  swatchPrimary: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  infoCol: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  themeName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  themeDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15
  },
  checkWrapper: {
    marginLeft: 10
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  uncheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5
  }
});
