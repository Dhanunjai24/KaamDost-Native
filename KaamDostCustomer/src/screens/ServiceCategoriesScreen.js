import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function ServiceCategoriesScreen({ onBack, onSelectService }) {
  const categories = [
    {
      id: 'cleaning',
      title: 'Home Cleaning',
      subtitle: 'Kitchen • Bathroom • Deep Cleaning',
      icon: '🧹',
      iconBg: '#eff6ff',
      price: '₹999',
      rating: '4.8 (2.3k)',
      duration: '2-3 hrs',
      included: [
        'Living room cleaning',
        'Kitchen cleaning',
        'Bathroom cleaning',
        'Floor cleaning',
      ],
    },
    {
      id: 'plumbing',
      title: 'Plumbing',
      subtitle: 'Repair • Pipe Fitting',
      icon: '🔧',
      iconBg: '#fefce8',
      price: '₹849',
      rating: '4.9 (1.8k)',
      duration: '1-2 hrs',
      included: [
        'Leakage repair & tap fixing',
        'Pipe installation & blockage removal',
        'Flush tank & bathroom fittings',
        'Water pressure check',
      ],
    },
    {
      id: 'electrician',
      title: 'Electrician',
      subtitle: 'Wiring • Fixing • Installation',
      icon: '⚡',
      iconBg: '#fefce8',
      price: '₹899',
      rating: '4.8 (2.1k)',
      duration: '1-2 hrs',
      included: [
        'Switchboard & socket repair',
        'Ceiling fan & light installation',
        'Short-circuit diagnosis',
        'MCB & fuse replacement',
      ],
    },
    {
      id: 'beauty',
      title: 'Beauty & Wellness',
      subtitle: 'Salon • Spa • Grooming',
      icon: '💆‍♀️',
      iconBg: '#fdf2f8',
      price: '₹799',
      rating: '4.9 (3.4k)',
      duration: '2 hrs',
      included: [
        'Facial & skincare treatment',
        'Hair styling & trimming',
        'Manicure & Pedicure',
        'Massage & Relaxation',
      ],
    },
    {
      id: 'appliance',
      title: 'Appliance Repair',
      subtitle: 'AC • Fridge • TV • Washing',
      icon: '📺',
      iconBg: '#eff6ff',
      price: '₹899',
      rating: '4.7 (1.2k)',
      duration: '2 hrs',
      included: [
        'Complete system inspection',
        'Gas refill & cooling check',
        'Spare parts diagnostics',
        'Functional performance test',
      ],
    },
    {
      id: 'pest_control',
      title: 'Pest Control',
      subtitle: 'General • Termite • Rodent',
      icon: '🛡️',
      iconBg: '#fef2f2',
      price: '₹1,099',
      rating: '4.8 (950)',
      duration: '2-3 hrs',
      included: [
        'Herbal gel application',
        'Termite & cockroach eradication',
        'Rodent trap placement',
        'Sanitization spray',
      ],
    },
    {
      id: 'painting',
      title: 'Painting',
      subtitle: 'Interior • Exterior',
      icon: '🎨',
      iconBg: '#fff7ed',
      price: '₹950',
      rating: '4.9 (1.5k)',
      duration: 'Full Day',
      included: [
        'Surface putty & sanding',
        'Double coat premium emulsion',
        'Ceiling & border finishing',
        'Post-painting cleanup',
      ],
    },
  ];

  const handleChoose = (cat) => {
    if (onSelectService) {
      onSelectService(cat);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_10 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Categories</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Categories List matching screen_10 */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleChoose(cat)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, { backgroundColor: cat.iconBg }]}>
                  <Text style={styles.iconEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.catTitle}>{cat.title}</Text>
                  <Text style={styles.catSubtitle}>{cat.subtitle}</Text>
                </View>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f294a',
  },
  scrollContent: {
    paddingBottom: 30,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 24,
  },
  textCol: {
    flex: 1,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  catSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 26,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
