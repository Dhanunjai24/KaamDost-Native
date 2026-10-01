import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function BookingTimelineScreen({
  booking,
  onBack,
  onProceedWorker,
  onCancelBooking,
}) {
  const steps = [
    {
      id: 1,
      title: 'Worker Assigned',
      desc: 'Rohit Kumar',
      time: '10:15 AM',
      completed: true,
      active: false,
    },
    {
      id: 2,
      title: 'On the Way',
      desc: 'Partner en route (1.4 km away)',
      time: '10:20 AM',
      completed: true,
      active: true,
    },
    {
      id: 3,
      title: 'Arrived',
      desc: 'At 123 Green Park, New Delhi',
      time: '10:30 AM',
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: 'In Progress',
      desc: 'Deep cleaning service',
      time: '10:45 AM',
      completed: false,
      active: false,
    },
  ];

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Free cancellation applies before worker arrival.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => onCancelBooking && onCancelBooking(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_18 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking in Progress</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Service Badge Header matching screen_18 */}
          <View style={styles.servicePillCard}>
            <View style={styles.servicePillIcon}>
              <Text style={styles.serviceEmoji}>🧹</Text>
            </View>
            <View>
              <Text style={styles.servicePillTitle}>Home Cleaning - Deep Cleaning</Text>
              <Text style={styles.servicePillSub}>Booking ID: {booking?.id || 'KD123456'}</Text>
            </View>
          </View>

          {/* Vertical Step Timeline matching screen_18 */}
          <View style={styles.timelineCard}>
            {steps.map((step, idx) => (
              <View key={step.id} style={styles.timelineItem}>
                {/* Node with connecting line */}
                <View style={styles.nodeCol}>
                  <View
                    style={[
                      styles.nodeOuter,
                      step.completed && styles.nodeOuterCompleted,
                      step.active && styles.nodeOuterActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.nodeInner,
                        step.completed && styles.nodeInnerCompleted,
                      ]}
                    />
                  </View>
                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.completed && styles.timelineLineActive,
                      ]}
                    />
                  )}
                </View>

                {/* Content */}
                <View style={styles.stepContent}>
                  <View style={styles.stepTextRow}>
                    <Text
                      style={[
                        styles.stepTitle,
                        step.active && styles.stepTitleActive,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons matching screen_18 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={onProceedWorker}
            activeOpacity={0.88}
          >
            <Text style={styles.proceedBtnText}>Proceed Worker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    paddingBottom: 20,
  },
  servicePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    marginBottom: 20,
    gap: 12,
    ...SHADOWS.small,
  },
  servicePillIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: {
    fontSize: 22,
  },
  servicePillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f294a',
  },
  servicePillSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 70,
  },
  nodeCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  nodeOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeOuterCompleted: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  nodeOuterActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  nodeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#cbd5e1',
  },
  nodeInnerCompleted: {
    backgroundColor: '#2563eb',
  },
  timelineLine: {
    flex: 1,
    width: 2.5,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  timelineLineActive: {
    backgroundColor: '#2563eb',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f294a',
  },
  stepTitleActive: {
    color: '#1d4ed8',
    fontWeight: '800',
  },
  stepTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  footer: {
    gap: 12,
    paddingTop: 10,
  },
  proceedBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.buttonGlow,
  },
  proceedBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
