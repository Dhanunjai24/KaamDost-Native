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
} from 'react-native';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function TrackingScreen({
  booking,
  onBack,
  onOpenChat,
  onOpenPayment,
  onCancelBooking,
}) {
  const [status, setStatus] = useState(booking?.status || 'ARRIVING');

  const currentBooking = booking || {
    id: 'KD123456',
    workerName: 'Rohit Kumar',
    workerPhone: '9848012345',
    workerRating: 4.7,
    tradeName: 'Home Cleaning - Deep Cleaning',
    startOtp: '4829',
    estimatedArrival: '10 minutes',
    totalAmount: 1237,
  };

  const handleCall = () => {
    Alert.alert('Calling Partner', `Dialing +91 ${currentBooking.workerPhone}...`);
  };

  const advanceDevSimulation = () => {
    if (status === 'ARRIVING') {
      setStatus('STARTED');
      Alert.alert('Worker Arrived', 'Worker entered OTP 4829. Service in progress!');
    } else if (status === 'STARTED') {
      setStatus('COMPLETED');
      if (onOpenPayment) onOpenPayment();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f7ff" />
      <View style={styles.container}>
        {/* Header matching screen_20 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Map Simulation Card matching screen_20 */}
          <View style={styles.mapCard}>
            <View style={styles.mapCanvas}>
              {/* Simulated Map Grid / Roads */}
              <View style={styles.roadHorizontal1} />
              <View style={styles.roadHorizontal2} />
              <View style={styles.roadVertical1} />
              <View style={styles.roadDiagonal} />

              {/* Blue Connecting Route Polyline */}
              <View style={styles.routePolyline} />

              {/* Worker Pin */}
              <View style={styles.workerPin}>
                <View style={styles.workerPinInner}>
                  <Text style={styles.workerPinEmoji}>👨‍🔧</Text>
                </View>
              </View>

              {/* Destination Pin (Green House) */}
              <View style={styles.destinationPin}>
                <Text style={styles.destPinEmoji}>📍</Text>
              </View>
            </View>
          </View>

          {/* Status Banner Card matching screen_20 */}
          <View style={styles.statusBannerCard}>
            <View style={styles.statusIconBox}>
              <Text style={styles.statusEmoji}>🚚</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={styles.statusTitle}>
                {status === 'ARRIVING'
                  ? 'Worker is on the way'
                  : status === 'STARTED'
                  ? 'Work In Progress'
                  : 'Job Completed'}
              </Text>
              <Text style={styles.statusSub}>
                {status === 'ARRIVING'
                  ? `Arriving in ${currentBooking.estimatedArrival || '10 minutes'}`
                  : status === 'STARTED'
                  ? 'Service underway at your location'
                  : 'Ready for payment'}
              </Text>
            </View>
          </View>

          {/* Start OTP Security Card */}
          <View style={styles.otpCard}>
            <View style={styles.otpTextCol}>
              <Text style={styles.otpTitle}>Job Security Start OTP</Text>
              <Text style={styles.otpSub}>Share this 4-digit code with worker to start</Text>
            </View>
            <View style={styles.otpPill}>
              <Text style={styles.otpDigits}>{currentBooking.startOtp || '4829'}</Text>
            </View>
          </View>

          {/* Worker Profile Card with Action Buttons matching screen_20 */}
          <View style={styles.workerCard}>
            <View style={styles.workerLeft}>
              <View style={styles.workerAvatarCircle}>
                <Text style={styles.workerAvatarEmoji}>👨‍🔧</Text>
              </View>
              <View>
                <Text style={styles.workerName}>{currentBooking.workerName}</Text>
                <Text style={styles.workerRating}>⭐ {currentBooking.workerRating} (786)</Text>
              </View>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.circleActionBtn} onPress={handleCall} activeOpacity={0.8}>
                <Text style={styles.actionEmoji}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleActionBtn} onPress={onOpenChat} activeOpacity={0.8}>
                <Text style={styles.actionEmoji}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Developer / Simulation Trigger */}
          <View style={styles.simCard}>
            <Text style={styles.simHeading}>⚡ Demo Simulation</Text>
            <TouchableOpacity style={styles.simBtn} onPress={advanceDevSimulation}>
              <Text style={styles.simBtnText}>
                {status === 'ARRIVING'
                  ? 'Simulate Worker Arrived (Start Job)'
                  : status === 'STARTED'
                  ? 'Simulate Work Complete → Open Payment'
                  : 'Open Payment Screen'}
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 20,
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
    gap: 14,
  },
  mapCard: {
    height: 240,
    borderRadius: 26,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.medium,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  roadHorizontal1: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#ffffff',
  },
  roadHorizontal2: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: '#ffffff',
  },
  roadVertical1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '45%',
    width: 22,
    backgroundColor: '#ffffff',
  },
  roadDiagonal: {
    position: 'absolute',
    top: 30,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#bbf7d0',
  },
  routePolyline: {
    position: 'absolute',
    top: 70,
    left: '35%',
    width: 90,
    height: 90,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#2563eb',
  },
  workerPin: {
    position: 'absolute',
    bottom: 45,
    left: '28%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  workerPinInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerPinEmoji: {
    fontSize: 24,
  },
  destinationPin: {
    position: 'absolute',
    top: 55,
    right: '25%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  destPinEmoji: {
    fontSize: 24,
  },
  statusBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  statusIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusEmoji: {
    fontSize: 22,
  },
  statusTextCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  statusSub: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 2,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  otpTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  otpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e3a8a',
  },
  otpSub: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 2,
    fontWeight: '500',
  },
  otpPill: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  otpDigits: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 2,
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#e0edfd',
    ...SHADOWS.small,
  },
  workerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workerAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  workerAvatarEmoji: {
    fontSize: 26,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f294a',
  },
  workerRating: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  circleActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 18,
  },
  simCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  simHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 8,
  },
  simBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
