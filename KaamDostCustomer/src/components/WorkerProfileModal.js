import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { t } from '../../../shared/i18n';

export default function WorkerProfileModal({ visible, worker, onClose, onBookDirect, onCallWorker }) {
  if (!worker) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Main Worker Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👷</Text>
            </View>
            <Text style={styles.name}>{worker.name}</Text>
            <Text style={styles.trade}>{worker.tradeName || worker.trade}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.badgeVerified}>
                <Text style={styles.badgeVerifiedText}>Aadhaar Verified ✓</Text>
              </View>
              <View style={styles.badgeSkill}>
                <Text style={styles.badgeSkillText}>Certified Partner</Text>
              </View>
            </View>

            {/* Key stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>⭐ {worker.rating || '4.9'}</Text>
                <Text style={styles.statLbl}>Rating ({worker.reviewsCount || 120})</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{worker.experienceYears || '7'} Yrs</Text>
                <Text style={styles.statLbl}>Field Experience</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>₹{worker.dailyRate || 850}</Text>
                <Text style={styles.statLbl}>Per Day Rate</Text>
              </View>
            </View>
          </View>

          {/* About & Skills */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Skills & Specializations</Text>
            <View style={styles.skillsList}>
              <Text style={styles.skillPill}>Brickwork & Plastering</Text>
              <Text style={styles.skillPill}>RCC Foundation</Text>
              <Text style={styles.skillPill}>Flooring & Tiles</Text>
              <Text style={styles.skillPill}>Renovation & Demolition</Text>
            </View>
          </View>

          {/* Service Area */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Service Coverage</Text>
            <Text style={styles.areaText}>
              📍 Base: {worker.city || 'Sangareddy'}, Telangana. Available within 15 km radius.
            </Text>
          </View>

          {/* Customer Reviews snippet */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recent Customer Reviews</Text>
            <View style={styles.reviewItem}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewerName}>Anil K.</Text>
                <Text style={styles.reviewRating}>★★★★★</Text>
              </View>
              <Text style={styles.reviewBody}>
                "Very punctual and neat work. Fixed our wall cracks and completed flooring on time."
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer CTAs */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.callBtn} onPress={() => onCallWorker(worker)}>
            <Text style={styles.callIcon}>📞</Text>
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookBtn} onPress={() => onBookDirect(worker)}>
            <Text style={styles.bookText}>⚡ {t('bookNow')} (₹{worker.dailyRate || 850}/day)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight
  },
  backBtn: {
    paddingRight: 8
  },
  backText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  content: {
    padding: 16
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  avatarEmoji: {
    fontSize: 36
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  trade: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16
  },
  badgeVerified: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  badgeVerifiedText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700'
  },
  badgeSkill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  badgeSkillText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '700'
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 14,
    width: '100%'
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillPill: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  areaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18
  },
  reviewItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  reviewRating: {
    color: '#f59e0b',
    fontSize: 12
  },
  reviewBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 10
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6
  },
  callIcon: {
    fontSize: 16
  },
  callText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary
  },
  bookBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  bookText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  }
});
