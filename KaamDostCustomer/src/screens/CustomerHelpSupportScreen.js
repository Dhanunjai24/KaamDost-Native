import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerHelpSupportScreen({
  onBack,
  onOpenLiveChat,
  onTabPress,
}) {
  const [selectedModal, setSelectedModal] = useState(null);

  const helpOptions = [
    {
      id: 'faqs',
      title: 'FAQs',
      icon: '❓',
      action: () => setSelectedModal('faqs'),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      icon: '📞',
      action: () => setSelectedModal('contact'),
    },
    {
      id: 'livechat',
      title: 'Live Chat',
      icon: '💬',
      action: onOpenLiveChat || (() => setSelectedModal('livechat')),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: '📄',
      action: () => setSelectedModal('terms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: '🔒',
      action: () => setSelectedModal('privacy'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Hero Icon and Title matching screen_27 */}
          <View style={styles.heroSection}>
            <View style={styles.headphoneCircle}>
              <Text style={styles.headphoneIcon}>🎧</Text>
            </View>
            <Text style={styles.heroTitle}>Need Help?</Text>
            <Text style={styles.heroSubtitle}>We're here for you</Text>
          </View>

          {/* Action List matching screen_27 */}
          <View style={styles.optionsList}>
            {helpOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionCard}
                onPress={opt.action}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.optionIcon}>{opt.icon}</Text>
                  </View>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Helpline Banner */}
          <View style={styles.helplineCard}>
            <View style={styles.helplineTextCol}>
              <Text style={styles.helplineTitle}>24/7 Telangana Helpline</Text>
              <Text style={styles.helplineDesc}>Toll-free assistance for customers & workers</Text>
              <Text style={styles.helplineNumber}>📞 1800-KAAMDOST (522-636)</Text>
            </View>
          </View>
        </ScrollView>

        {/* Modal for Details */}
        <Modal
          visible={!!selectedModal}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedModal === 'faqs' && 'Frequently Asked Questions'}
                {selectedModal === 'contact' && 'Contact Support'}
                {selectedModal === 'livechat' && 'Live AI Assistant'}
                {selectedModal === 'terms' && 'Terms & Conditions'}
                {selectedModal === 'privacy' && 'Privacy Policy'}
              </Text>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {selectedModal === 'faqs' && (
                  <View>
                    <Text style={styles.faqQ}>Q: How does KaamDost ensure fair pricing?</Text>
                    <Text style={styles.faqA}>A: KaamDost charges 0% commission from workers. Customers pay standard state-notified wage slabs directly.</Text>

                    <Text style={styles.faqQ}>Q: How does OTP verification work?</Text>
                    <Text style={styles.faqA}>A: A 4-digit start OTP is shared once the worker arrives at your doorstep to begin work safely.</Text>

                    <Text style={styles.faqQ}>Q: How do I cancel a booking?</Text>
                    <Text style={styles.faqA}>A: You can cancel free of charge before worker arrival directly from the Live Tracking screen.</Text>
                  </View>
                )}
                {selectedModal === 'contact' && (
                  <View>
                    <Text style={styles.modalBody}>
                      For immediate support, call our 24/7 hotline at 1800-KAAMDOST or email us at support@kaamdost.in.
                    </Text>
                    <Text style={styles.modalBody}>
                      State Labour Welfare Desk: Hyderabad, Telangana.
                    </Text>
                  </View>
                )}
                {selectedModal === 'terms' && (
                  <View>
                    <Text style={styles.modalBody}>
                      1. KaamDost connects verified daily-wage service providers with households and businesses.
                    </Text>
                    <Text style={styles.modalBody}>
                      2. All workers undergo UIDAI Aadhaar verification and live selfie face-match.
                    </Text>
                    <Text style={styles.modalBody}>
                      3. Direct UPI payments ensure instant transparent settlement without middleman fee.
                    </Text>
                  </View>
                )}
                {selectedModal === 'privacy' && (
                  <View>
                    <Text style={styles.modalBody}>
                      Your privacy is sacred. Aadhaar numbers are masked (only last 4 digits visible) and location data is encrypted during live job tracking.
                    </Text>
                  </View>
                )}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedModal(null)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Bottom 5-Tab Bar */}
        <BottomTabBar
          activeTab="profile"
          onTabPress={(tab) => {
            if (onTabPress) onTabPress(tab);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 28,
    color: '#0F294A',
    lineHeight: 32,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F294A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  headphoneCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  headphoneIcon: {
    fontSize: 44,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F294A',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  optionsList: {
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  chevron: {
    fontSize: 24,
    color: '#94A3B8',
    fontWeight: '600',
  },
  helplineCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 8,
  },
  helplineTextCol: {
    alignItems: 'center',
  },
  helplineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  helplineDesc: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 10,
    textAlign: 'center',
  },
  helplineNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 41, 74, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F294A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    marginBottom: 20,
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 4,
  },
  faqA: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 12,
  },
  modalCloseBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
