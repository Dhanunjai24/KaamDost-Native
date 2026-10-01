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

export default function CustomerNotificationsScreen({ onBack }) {
  const notifications = [
    {
      id: 1,
      title: 'Booking confirmed',
      desc: 'Home Cleaning • KD123456',
      time: '10:15 AM',
      type: 'blue',
      icon: '📋',
    },
    {
      id: 2,
      title: 'Worker is on the way',
      desc: 'At your location (10 mins away)',
      time: '10:30 AM',
      type: 'blue',
      icon: '🚚',
    },
    {
      id: 3,
      title: 'Payment successful',
      desc: '₹1,237 settled via UPI',
      time: '11:45 AM',
      type: 'green',
      icon: '💳',
    },
    {
      id: 4,
      title: 'Your booking is completed',
      desc: 'Home Cleaning • KD123456',
      time: '12:30 PM',
      type: 'blue',
      icon: '✅',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_21 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.card}>
              <View
                style={[
                  styles.iconBox,
                  item.type === 'green' ? styles.iconBoxGreen : styles.iconBoxBlue,
                ]}
              >
                <Text style={styles.iconEmoji}>{item.icon}</Text>
              </View>

              <View style={styles.textCol}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.descText}>{item.desc}</Text>
              </View>
            </View>
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
    marginBottom: 20,
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
    gap: 14,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconBoxBlue: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  iconBoxGreen: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textCol: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f294a',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  descText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
});
