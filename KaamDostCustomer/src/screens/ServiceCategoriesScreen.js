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
      subtitle: 'Repair • Pipe Fitting • Tap Fixing',
      icon: '🔧',
      iconBg: '#f0fdfa',
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
      subtitle: 'AC • Fridge • TV • Washing Machine',
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
      subtitle: 'General • Termite • Cockroach • Rodent',
      icon: '🛡️',
      iconBg: '#fef2f2',
      price: '₹1,099',
      rating: '4.8 (950)',
      duration: '1-2 hrs',
      included: [
        'Odorless chemical treatment',
        'Kitchen drain disinfection',
        'Wall crevice spray',
        'Post-service guarantee certificate',
      ],
    },
    {
      id: 'painting',
      title: 'Painting',
      subtitle: 'Interior • Exterior • Wall Decor',
      icon: '🎨',
      iconBg: '#f3e8ff',
      price: '₹1,499',
      rating: '4.9 (1.5k)',
      duration: 'Full Day',
      included: [
        'Surface putty & sanding',
        'Double coat premium primer',
        'Royal emulsion paint finish',
        'Furniture masking & floor cleanup',
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Header matching screen_10 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Categories</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Stack of distinct frosted glass row cards */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => onSelectService && onSelectService(cat)}
              activeOpacity={0.78}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, { backgroundColor: cat.iconBg }]}>
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
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
    backgroundColor: '#f0f6ff',
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
    paddingVertical: 10,
    marginBottom: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f2c6e',
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2c6e',
  },
  scrollContent: {
    paddingVertical: 6,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    ...SHADOWS.sm,
  },
  catEmoji: {
    fontSize: 22,
  },
  textCol: {
    flex: 1,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 3,
  },
  catSubtitle: {
    fontSize: 12,
    color: '#5f7da6',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 10,
  },
});
