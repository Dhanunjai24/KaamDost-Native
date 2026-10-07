import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import ChatModal from '../components/ChatModal';
import PaymentModal from '../components/PaymentModal';
import RatingTipModal from '../components/RatingTipModal';
import LeafletMapView from '../../../shared/components/gps/LeafletMapView';
import SosModal from '../../../shared/components/sos/SosModal';
import VoicePlayer from '../../../shared/components/voice/VoicePlayer';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { STATUS_LABELS } from '../../../shared/constants/states';
import { t } from '../../../shared/i18n';

export default function TrackingScreen({ booking, onBack, onCompleteBooking, onCancelBooking }) {
  const [showChat, setShowChat] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'ARRIVING');

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No Active Booking</Text>
          <Text style={styles.emptyDesc}>You have no orders currently in transit or in progress.</Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={onBack}>
            <Text style={styles.backHomeText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const steps = [
    { key: 'ACCEPTED', label: 'Partner Assigned', icon: '👤' },
    { key: 'ARRIVING', label: 'Partner En Route', icon: '🚚' },
    { key: 'STARTED', label: 'Work in Progress', icon: '⚡' },
    { key: 'COMPLETED', label: 'Job Completed', icon: '✅' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'REQUESTED':
      case 'OFFERED':
      case 'ACCEPTED':
        return 0;
      case 'ARRIVING':
        return 1;
      case 'STARTED':
        return 2;
      case 'COMPLETED':
      case 'PAYMENT_CONFIRMED':
      case 'RATED':
        return 3;
      default:
        return 1;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  // Simulation controls for testing the complete lifecycle
  const advanceStatus = () => {
    if (currentStatus === 'ARRIVING') {
      setCurrentStatus('STARTED');
    } else if (currentStatus === 'STARTED') {
      setCurrentStatus('COMPLETED');
      setShowPayment(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live GPS Tracking</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.sosHeaderBtn} onPress={() => setShowSos(true)}>
            <Text style={styles.sosHeaderText}>🚨 SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Cancel Booking',
                'Are you sure you want to cancel this booking? Free cancellation applies.',
                [
                  { text: 'No', style: 'cancel' },
                  { text: 'Yes, Cancel', style: 'destructive', onPress: () => onCancelBooking && onCancelBooking(booking.id) }
                ]
              );
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Interactive OpenStreetMap Leaflet GPS View */}
        <View style={styles.leafletWrapper}>
          <LeafletMapView
            customerLocation={{ lat: 17.6190, lng: 78.0805, title: booking.address || 'Customer Site' }}
            workerLocation={{ lat: 17.6275, lng: 78.0890, title: booking.workerName || 'Worker Live' }}
            height={260}
          />
          <View style={styles.etaBar}>
            <Text style={styles.etaText}>
              ETA: <Text style={styles.etaBold}>{booking.estimatedArrival || '12 mins'}</Text> • 1.4 km distance
            </Text>
          </View>
        </View>

        {/* Regional Voice Audio Speech Player */}
        <View style={styles.voiceSection}>
          <VoicePlayer
            text={`మీ వర్కర్ ${booking.workerName || 'రమేష్ రెడ్డి'} మీ లొకేషన్‌కు వస్తున్నారు. అంచనా సమయం పన్నెండు నిమిషాలు.`}
            lang="te"
            label="వాయిస్ అప్‌డేట్ వినండి (Telugu Audio ETA)"
          />
        </View>

        {/* Stepper Progress */}
        <View style={styles.stepperCard}>
          <Text style={styles.cardHeading}>Service Status</Text>
          <View style={styles.stepsRow}>
            {steps.map((st, i) => {
              const isPastOrCurrent = i <= activeIndex;
              return (
                <View key={st.key} style={styles.stepCol}>
                  <View style={[styles.stepCircle, isPastOrCurrent && styles.stepCircleActive]}>
                    <Text style={styles.stepEmoji}>{st.icon}</Text>
                  </View>
                  <Text style={[styles.stepLabel, isPastOrCurrent && styles.stepLabelActive]}>
                    {st.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Start OTP Display */}
        <View style={styles.otpCard}>
          <View style={styles.otpLeft}>
            <Text style={styles.otpTitle}>Job Security Start OTP</Text>
            <Text style={styles.otpSub}>Share this 4-digit code with worker to begin work</Text>
          </View>
          <View style={styles.otpBadge}>
            <Text style={styles.otpDigits}>{booking.startOtp || '4829'}</Text>
          </View>
        </View>

        {/* Worker Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerEmoji}>👷</Text>
          </View>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{booking.workerName || 'Ramesh Reddy'}</Text>
            <Text style={styles.workerTrade}>{booking.tradeName || 'Mason'}</Text>
            <Text style={styles.workerRating}>⭐ {booking.workerRating || '4.9'} • 140+ Jobs Completed</Text>
          </View>
          <View style={styles.workerActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowChat(true)}>
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert('Call Partner', `Dialing +91 ${booking.workerPhone || '9848012345'}`)}
            >
              <Text style={styles.actionIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeading}>Booking Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailVal}>{booking.id || 'BK-8492'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailVal}>{booking.address || 'Sangareddy, Telangana'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily Rate</Text>
            <Text style={styles.detailVal}>₹{booking.dailyRate || 950} / day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{booking.totalAmount || 1045}</Text>
          </View>
        </View>

        {/* Simulation Action Bar */}
        <View style={styles.simBox}>
          <Text style={styles.simTitle}>⚡ Developer / Demo Action</Text>
          <TouchableOpacity style={styles.simBtn} onPress={advanceStatus}>
            <Text style={styles.simBtnText}>
              {currentStatus === 'ARRIVING'
                ? 'Simulate Worker Arrived & Started'
                : currentStatus === 'STARTED'
                ? 'Simulate Job Completed → Open Payment'
                : 'Job Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <ChatModal
        visible={showChat}
        partnerName={booking.workerName || 'Ramesh Reddy'}
        onClose={() => setShowChat(false)}
      />

      <PaymentModal
        visible={showPayment}
        amount={booking.totalAmount || 1045}
        onClose={() => setShowPayment(false)}
        onSuccess={(payInfo) => {
          setShowPayment(false);
          setShowRating(true);
        }}
      />

      <RatingTipModal
        visible={showRating}
        workerName={booking.workerName || 'Ramesh Reddy'}
        onClose={() => {
          setShowRating(false);
          if (onCompleteBooking) onCompleteBooking(booking);
          onBack();
        }}
        onSubmit={(review) => {
          setShowRating(false);
          if (onCompleteBooking) onCompleteBooking(booking);
          onBack();
        }}
      />

      <SosModal
        visible={showSos}
        onClose={() => setShowSos(false)}
        userRole="customer"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  sosHeaderBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  sosHeaderText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12
  },
  leafletWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden'
  },
  voiceSection: {
    marginBottom: 16
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
  cancelText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700'
  },
  content: {
    padding: 16
  },
  mapCard: {
    height: 140,
    backgroundColor: '#cbd5e1',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  mapOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  mapPulse: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  workerPin: {
    fontSize: 26
  },
  destPin: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  housePin: {
    fontSize: 26
  },
  etaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 8,
    alignItems: 'center'
  },
  etaText: {
    color: COLORS.textWhite,
    fontSize: 12
  },
  etaBold: {
    fontWeight: '800',
    color: COLORS.primarySoft
  },
  stepperCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.small
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 10
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stepCol: {
    flex: 1,
    alignItems: 'center'
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  stepCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  stepEmoji: {
    fontSize: 16
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '600'
  },
  stepLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '800'
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    marginBottom: 12
  },
  otpLeft: {
    flex: 1,
    paddingRight: 8
  },
  otpTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  otpSub: {
    fontSize: 11,
    color: COLORS.primaryDark,
    marginTop: 2,
    opacity: 0.85
  },
  otpBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  otpDigits: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.small
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  workerEmoji: {
    fontSize: 24
  },
  workerInfo: {
    flex: 1
  },
  workerName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  workerTrade: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary
  },
  workerRating: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  workerActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIcon: {
    fontSize: 16
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 8
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary
  },
  simBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fef3c7'
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 6
  },
  simBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  simBtnText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20
  },
  backHomeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  backHomeText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 14
  }
});
