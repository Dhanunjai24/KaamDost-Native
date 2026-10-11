import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatModal from '../components/ChatModal';
import PaymentModal from '../components/PaymentModal';
import RatingTipModal from '../components/RatingTipModal';
import GlassFloatingBottomNav from '../../../shared/components/glass/GlassFloatingBottomNav';
import LeafletMapView from '../../../shared/components/gps/LeafletMapView';
import SosModal from '../../../shared/components/sos/SosModal';
import GlassAlertDialog from '../../../shared/components/glass/GlassAlertDialog';
import VoicePlayer from '../../../shared/components/voice/VoicePlayer';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';
import { STATUS_LABELS } from '../../../shared/constants/states';
import { t } from '../../../shared/i18n';
import socketService from '../services/socketService';
import realtimeService from '../../../shared/services/realtimeService';

export default function TrackingScreen({
  booking,
  onBack,
  onOpenHome,
  onOpenFindWorkers,
  onOpenBookings,
  onOpenTracking,
  onOpenDashboard,
  onCompleteBooking,
  onCancelBooking
}) {
  const [showChat, setShowChat] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [liveBooking, setLiveBooking] = useState(booking);
  const [currentStatus, setCurrentStatus] = useState(booking?.status || 'REQUESTED');
  const [liveEta, setLiveEta] = useState(booking?.estimatedArrival || '12 mins');
  const [liveDistance, setLiveDistance] = useState('1.4');
  const [workerCoords, setWorkerCoords] = useState({ lat: 17.6275, lng: 78.0890 });
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);

  useEffect(() => {
    if (booking) {
      setLiveBooking(booking);
      if (booking.status) {
        setCurrentStatus(booking.status);
      }
    }
  }, [booking]);

  // Sync real-time acceptance & live worker telemetry
  useEffect(() => {
    // 1. Listen for real-time booking acceptance by worker
    const unsubAccept = realtimeService.on('booking_accepted', (data) => {
      console.log('[TrackingScreen] Worker accepted booking:', data);
      if (data && data.worker) {
        setLiveBooking((prev) => ({
          ...(prev || {}),
          id: data.bookingId || (prev && prev.id),
          workerId: data.workerId || data.worker.id,
          workerName: data.worker.name,
          workerPhone: data.worker.phone || '',
          workerRating: data.worker.rating || '4.9',
          workerAvatar: data.worker.avatar || data.worker.selfieUri || null,
          workerTrade: data.worker.trade,
          tradeName: data.worker.tradeName || (prev && prev.tradeName) || 'Specialist',
          status: 'ARRIVING',
          estimatedArrival: data.worker.etaMinutes ? `${data.worker.etaMinutes} mins` : '12 mins'
        }));
        setCurrentStatus('ARRIVING');
        if (data.worker.etaMinutes) setLiveEta(`${data.worker.etaMinutes} mins`);
      }
    });

    // 2. Listen for live worker GPS telemetry
    const unsubLoc = realtimeService.on('worker_location_update', (data) => {
      if (data.latitude && data.longitude) {
        setWorkerCoords({ lat: data.latitude, lng: data.longitude });
      }
      if (data.etaMinutes) setLiveEta(`${data.etaMinutes} mins`);
      if (data.distanceKm) setLiveDistance(String(data.distanceKm));
      if (data.status) setCurrentStatus(data.status);
    });

    // 3. Listen for job status changes
    const unsubStatus = realtimeService.on('job_status_updated', (data) => {
      if (data && data.status) {
        setCurrentStatus(data.status);
        setLiveBooking((prev) => (prev ? { ...prev, status: data.status } : null));
      }
    });

    // 4. Socket fallback
    const unsubSocket = booking?.id
      ? socketService.subscribeToWorkerLocation(booking.id, (data) => {
          if (data.etaText) setLiveEta(data.etaText);
          if (data.distanceKm) setLiveDistance(data.distanceKm);
          if (data.status === 'ARRIVED' && currentStatus === 'ARRIVING') {
            setCurrentStatus('ARRIVED');
          }
        })
      : null;

    return () => {
      if (unsubAccept) unsubAccept();
      if (unsubLoc) unsubLoc();
      if (unsubStatus) unsubStatus();
      if (unsubSocket) unsubSocket();
    };
  }, [booking?.id, currentStatus]);

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

        {/* Floating Capsule Bottom Navigation Bar */}
        <GlassFloatingBottomNav
          activeId="bookings"
          onSelect={(id) => {
            if (id === 'home') (onOpenHome ? onOpenHome() : onBack());
            else if (id === 'jobs' || id === 'works' || id === 'trades' || id === 'workers') (onOpenFindWorkers ? onOpenFindWorkers() : null);
            else if (id === 'bookings' || id === 'orders' || id === 'history') (onOpenBookings ? onOpenBookings() : null);
            else if (id === 'profile') (onOpenDashboard ? onOpenDashboard() : null);
          }}
        />
      </SafeAreaView>
    );
  }

  const isSearching = currentStatus === 'REQUESTED' || currentStatus === 'SEARCHING' || !liveBooking?.workerId;

  const steps = [
    { key: 'REQUESTED', label: 'Request Sent', icon: '📡' },
    { key: 'ARRIVING', label: 'Partner Assigned', icon: '👤' },
    { key: 'STARTED', label: 'Work in Progress', icon: '⚡' },
    { key: 'COMPLETED', label: 'Job Completed', icon: '✅' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'REQUESTED':
      case 'OFFERED':
      case 'SEARCHING':
        return 0;
      case 'ACCEPTED':
      case 'ASSIGNED':
      case 'ARRIVING':
        return 1;
      case 'STARTED':
        return 2;
      case 'COMPLETED':
      case 'PAYMENT_CONFIRMED':
      case 'RATED':
        return 3;
      default:
        return isSearching ? 0 : 1;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  // Simulation controls for testing the complete lifecycle
  const advanceStatus = () => {
    if (currentStatus === 'REQUESTED' || isSearching) {
      setCurrentStatus('ARRIVING');
      setLiveBooking((prev) => ({
        ...(prev || {}),
        workerId: 'worker_demo_101',
        workerName: 'Ramesh Kumar',
        workerPhone: '9848012345',
        workerRating: '4.9',
        status: 'ARRIVING',
        estimatedArrival: '12 mins'
      }));
    } else if (currentStatus === 'ARRIVING') {
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
        <Text style={styles.headerTitle}>
          {isSearching ? 'Finding Nearby Partner' : 'Live Partner Tracking'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.sosHeaderBtn} onPress={() => setShowSos(true)}>
            <Text style={styles.sosHeaderText}>🚨 SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCancelModalVisible(true)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* If Searching, show animated radar view. If assigned, show Leaflet map! */}
        {isSearching ? (
          <View style={styles.radarCardBox}>
            <View style={styles.radarPulseRing}>
              <View style={styles.radarPulseCore}>
                <Text style={styles.radarEmojiBig}>📡</Text>
              </View>
            </View>
            <Text style={styles.radarHeading}>
              Searching for Nearby Specialist
            </Text>
            <Text style={styles.radarAddressSub}>
              {liveBooking?.tradeName || 'Specialist'} • {liveBooking?.address || 'Sangareddy, Telangana'}
            </Text>
            <Text style={styles.radarDescription}>
              Request broadcasted to verified workers within 15 km. The nearest available worker will receive a sound and vibration alert on their phone to accept.
            </Text>
            <View style={styles.radarPulseBadge}>
              <Text style={styles.radarPulseText}>● Real-time dispatch radar active</Text>
            </View>
          </View>
        ) : (
          <View style={styles.leafletWrapper}>
            <LeafletMapView
              customerLocation={{ lat: 17.6190, lng: 78.0805, title: liveBooking?.address || 'Customer Site' }}
              workerLocation={{ lat: workerCoords.lat, lng: workerCoords.lng, title: liveBooking?.workerName || 'Worker Live' }}
              height={260}
            />
            <View style={styles.etaBar}>
              <Text style={styles.etaText}>
                ETA: <Text style={styles.etaBold}>{liveEta || liveBooking?.estimatedArrival || '12 mins'}</Text> ({liveDistance} km away)
              </Text>
            </View>
          </View>
        )}

        {/* Regional Voice Audio Speech Player */}
        <View style={styles.voiceSection}>
          <VoicePlayer
            text={
              isSearching
                ? 'మీ పని అభ్యర్థన సమీపంలోని కార్మికులకు పంపబడింది. వర్కర్ అంగీకరించే వరకు దయచేసి వేచి ఉండండి.'
                : `మీ వర్కర్ ${liveBooking?.workerName || 'నిపుణుడు'} మీ లొకేషన్‌కు వస్తున్నారు. అంచనా సమయం ${liveEta || 'పన్నెండు నిమిషాలు'}.`
            }
            lang="te"
            label={isSearching ? 'వాయిస్ అప్‌డేట్ వినండి (Telugu Request Status)' : 'వాయిస్ అప్‌డేట్ వినండి (Telugu Audio ETA)'}
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
        {isSearching ? (
          <View style={styles.otpCardPending}>
            <View style={styles.otpLeft}>
              <Text style={styles.otpTitle}>Job Security Start OTP</Text>
              <Text style={styles.otpSub}>OTP will be revealed once a worker accepts your request</Text>
            </View>
            <View style={styles.otpBadgePending}>
              <Text style={styles.otpDigitsPending}>••••</Text>
            </View>
          </View>
        ) : (
          <View style={styles.otpCard}>
            <View style={styles.otpLeft}>
              <Text style={styles.otpTitle}>Job Security Start OTP</Text>
              <Text style={styles.otpSub}>Share this 4-digit code with worker to begin work</Text>
            </View>
            <View style={styles.otpBadge}>
              <Text style={styles.otpDigits}>{liveBooking?.startOtp || '----'}</Text>
            </View>
          </View>
        )}

        {/* Worker Card */}
        {isSearching ? (
          <View style={styles.workerCardPending}>
            <View style={[styles.workerAvatar, { backgroundColor: '#F1F5F9' }]}>
              <Text style={styles.workerEmoji}>⏳</Text>
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>Waiting for Worker Acceptance...</Text>
              <Text style={styles.workerTrade}>{liveBooking?.tradeName || 'Specialist'} • Sangareddy</Text>
              <Text style={[styles.workerRating, { color: COLORS.textMuted }]}>
                Verified partner details, direct call & chat options will appear upon acceptance
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.workerCard}>
            <View style={styles.workerAvatar}>
              {(liveBooking?.workerAvatar || liveBooking?.avatar || liveBooking?.selfieUri) ? (
                <Image
                  source={{ uri: liveBooking.workerAvatar || liveBooking.avatar || liveBooking.selfieUri }}
                  style={styles.workerAvatarImg}
                />
              ) : (
                <Text style={styles.workerEmoji}>👷</Text>
              )}
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{liveBooking?.workerName || 'Assigned Partner'}</Text>
              <Text style={styles.workerTrade}>{liveBooking?.tradeName || liveBooking?.workerTradeName || 'Specialist'}</Text>
              <View style={styles.workerMetaRow}>
                <Text style={styles.workerRating}>{liveBooking?.workerRating ? (`⭐ ${liveBooking.workerRating} Verified`) : '⭐ 4.9 Verified'}</Text>
                {liveBooking?.workerPhone ? (
                  <Text style={styles.workerPhoneText}> • +91 {liveBooking.workerPhone}</Text>
                ) : null}
              </View>
            </View>
            <View style={styles.workerActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowChat(true)}>
                <Text style={styles.actionIcon}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  const phone = liveBooking?.workerPhone || '9848012345';
                  Linking.openURL(`tel:${phone}`).catch(() => {
                    setCallModalVisible(true);
                  });
                }}
              >
                <Text style={styles.actionIcon}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeading}>Booking Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailVal}>{booking.id || ('BK-' + String(booking.trade || '').slice(0, 4).toUpperCase())}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailVal}>{booking.address || 'Service Location'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily Rate</Text>
            <Text style={styles.detailVal}>₹{booking.dailyRate || 0} / day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{booking.totalAmount || 0}</Text>
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

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Capsule Bottom Navigation Bar */}
      <GlassFloatingBottomNav
        activeId="bookings"
        onSelect={(id) => {
          if (id === 'home') (onOpenHome ? onOpenHome() : onBack());
          else if (id === 'jobs' || id === 'works' || id === 'trades' || id === 'workers') (onOpenFindWorkers ? onOpenFindWorkers() : null);
          else if (id === 'bookings' || id === 'orders' || id === 'history') (onOpenBookings ? onOpenBookings() : null);
          else if (id === 'profile') (onOpenDashboard ? onOpenDashboard() : null);
        }}
      />

      {/* Modals */}
      <ChatModal
        visible={showChat}
        partnerName={booking.workerName || 'Partner'}
        partnerPhone={booking.workerPhone || ''}
        bookingId={booking.id || 'BK-LIVE'}
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
        workerName={booking.workerName || 'Partner'}
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
    padding: 16,
    paddingBottom: 90
  },
  radarCardBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#7DD3FC',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.small
  },
  radarPulseRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  radarPulseCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radarEmojiBig: {
    fontSize: 28
  },
  radarHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0369A1',
    textAlign: 'center',
    marginBottom: 4
  },
  radarAddressSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8
  },
  radarDescription: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    maxWidth: 280
  },
  radarPulseBadge: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  radarPulseText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7'
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
  otpCardPending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  otpBadgePending: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  otpDigitsPending: {
    fontSize: 16,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 2
  },
  workerCardPending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
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
  workerAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  workerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  workerPhoneText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
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
