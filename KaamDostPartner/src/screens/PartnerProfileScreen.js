import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/theme/ThemeContext';
import GlassBackground from '../../../shared/components/glass/GlassBackground';
import GlassCard from '../../../shared/components/glass/GlassCard';
import GlassButton from '../../../shared/components/glass/GlassButton';
import ThemeSwitcherModal from '../../../shared/components/glass/ThemeSwitcherModal';
import { t } from '../../../shared/i18n';

export default function PartnerProfileScreen({ partner, onBack, onLogout, onRestartOnboarding }) {
  const { theme, themeId, switchTheme, shadows } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const themesSummary = [
    {
      id: 'slate_orange',
      name: 'Dark Slate + Saffron Orange',
      subtitle: 'Partner Hero • High-visibility outdoor contrast',
      bg: '#0B1320',
      primary: '#FF6B00'
    },
    {
      id: 'light_navy',
      name: 'Light + Navy Blue',
      subtitle: 'Cool white & Royal navy typography',
      bg: '#F4F8FC',
      primary: '#0B2341'
    },
    {
      id: 'white_teal',
      name: 'White + Deep Teal',
      subtitle: 'Fresh mint & Authoritative teal',
      bg: '#F6FBFA',
      primary: '#073B3A'
    },
    {
      id: 'ivory_indigo',
      name: 'Soft Ivory + Deep Indigo',
      subtitle: 'Warm ivory & Aristocratic indigo',
      bg: '#FAF9F6',
      primary: '#25234A'
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundPrimary} />

      <GlassBackground>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.glassSurfaceStrong, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={[styles.backText, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Partner Profile & Appearance
          </Text>
          <TouchableOpacity
            onPress={() => setShowThemeModal(true)}
            style={[styles.paletteBtn, { backgroundColor: theme.primaryLight || 'rgba(255,107,0,0.15)' }]}
            activeOpacity={0.7}
          >
            <Text style={styles.paletteIcon}>🎨</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile Card */}
          <GlassCard style={styles.profileCard} variant="strong">
            <View style={[styles.avatar, { borderColor: theme.accentPrimary }]}>
              <Text style={styles.avatarEmoji}>👷</Text>
            </View>
            <Text style={[styles.name, { color: theme.textPrimary }]}>{partner?.name || 'Ramesh Reddy'}</Text>
            <Text style={[styles.trade, { color: theme.accentPrimary }]}>{partner?.tradeName || 'Mason / Civil Work'}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.verifiedBadge, { backgroundColor: theme.successLight, borderColor: theme.success }]}>
                <Text style={[styles.verifiedText, { color: theme.success }]}>Aadhaar Verified ✓</Text>
              </View>
              <View style={[styles.starBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
                <Text style={styles.starText}>★ 4.9 (142 Reviews)</Text>
              </View>
            </View>
          </GlassCard>

          {/* Appearance & Theme Selector Section */}
          <GlassCard style={styles.themeSectionCard} variant="strong">
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Appearance & 2-Color Theme
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Select your preferred high-visibility visual system
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowThemeModal(true)}
                style={[styles.quickChangeBtn, { backgroundColor: theme.primaryLight || 'rgba(255,107,0,0.15)' }]}
              >
                <Text style={[styles.quickChangeText, { color: theme.accentPrimary }]}>
                  All Themes
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.themeOptionsGrid}>
              {themesSummary.map((tItem) => {
                const isActive = themeId === tItem.id;
                return (
                  <TouchableOpacity
                    key={tItem.id}
                    style={[
                      styles.themePillCard,
                      {
                        backgroundColor: isActive ? (theme.primaryLight || 'rgba(255,107,0,0.15)') : theme.glassSurface,
                        borderColor: isActive ? theme.accentPrimary : theme.border
                      }
                    ]}
                    onPress={() => switchTheme(tItem.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.themeSwatch,
                        { backgroundColor: tItem.bg, borderColor: tItem.primary }
                      ]}
                    >
                      <View
                        style={[styles.themeSwatchDot, { backgroundColor: tItem.primary }]}
                      />
                    </View>
                    <View style={styles.themeInfoCol}>
                      <Text
                        style={[
                          styles.themeTitleText,
                          {
                            color: theme.textPrimary,
                            fontWeight: isActive ? '900' : '700'
                          }
                        ]}
                      >
                        {tItem.name}
                      </Text>
                      <Text style={[styles.themeSubText, { color: theme.textSecondary }]}>
                        {tItem.subtitle}
                      </Text>
                    </View>
                    {isActive && (
                      <View
                        style={[
                          styles.activeCheckPill,
                          { backgroundColor: theme.accentPrimary }
                        ]}
                      >
                        <Text style={styles.checkIcon}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Work & Rate Information */}
          <GlassCard style={styles.infoCard} variant="default">
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Service & Daily Rate</Text>

            <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Daily Base Wage</Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>₹{partner?.dailyRate || 950} / day</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Operating City</Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>{partner?.city || 'Sangareddy, Telangana'}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Trade Experience</Text>
              <Text style={[styles.infoVal, { color: theme.textPrimary }]}>{partner?.experienceYears || 8} Years</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>e-Shram Status</Text>
              <Text style={[styles.infoVal, { color: theme.success }]}>Registered (UAN Verified)</Text>
            </View>
          </GlassCard>

          {/* 6-Step Registration Review Trigger */}
          <TouchableOpacity
            style={[
              styles.stepTriggerBtn,
              {
                backgroundColor: theme.primaryLight || 'rgba(255, 107, 0, 0.12)',
                borderColor: theme.accentPrimary
              }
            ]}
            onPress={onRestartOnboarding || onLogout}
          >
            <View>
              <Text style={[styles.stepTriggerTitle, { color: theme.accentPrimary }]}>Review 6-Step Registration</Text>
              <Text style={[styles.stepTriggerSub, { color: theme.textSecondary }]}>Language • Mobile • Profile • Base • KYC • Activation</Text>
            </View>
            <Text style={[styles.stepTriggerArrow, { color: theme.accentPrimary }]}>→</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <GlassButton
            title="Log Out of Partner Account"
            onPress={onLogout}
            variant="secondary"
            size="large"
            style={{
              marginTop: 10,
              marginBottom: 34,
              borderColor: theme.danger,
              backgroundColor: theme.dangerLight
            }}
            textStyle={{ color: theme.danger }}
          />
        </ScrollView>

        {/* Global Theme Switcher Sheet */}
        <ThemeSwitcherModal
          visible={showThemeModal}
          onClose={() => setShowThemeModal(false)}
        />
      </GlassBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backText: {
    fontSize: 22,
    fontWeight: '700'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  paletteBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  paletteIcon: {
    fontSize: 18
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontSize: 22, fontWeight: '800' },
  trade: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  verifiedText: { fontSize: 12, fontWeight: '700' },
  starBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  starText: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },
  themeSectionCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  quickChangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  quickChangeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  themeOptionsGrid: {
    gap: 8
  },
  themePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.2
  },
  themeSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  themeSwatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7
  },
  themeInfoCol: {
    flex: 1
  },
  themeTitleText: {
    fontSize: 13,
    letterSpacing: -0.2
  },
  themeSubText: {
    fontSize: 10,
    marginTop: 1
  },
  activeCheckPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  infoCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  infoLabel: { fontSize: 13, fontWeight: '600' },
  infoVal: { fontSize: 13, fontWeight: '700' },
  stepTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16
  },
  stepTriggerTitle: { fontSize: 14, fontWeight: '800' },
  stepTriggerSub: { fontSize: 11, marginTop: 2 },
  stepTriggerArrow: { fontSize: 18, fontWeight: '800' }
});
