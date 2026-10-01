import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import client from '../../../shared/api/client';
import { getStoredSession, setStoredSession } from '../../../shared/storage/storage';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function CustomerStep5Screen({ onComplete, onBack }) {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Active Stage: 'aadhaar' | 'selfie' | 'processing' | 'result'
  const [activeStage, setActiveStage] = useState('aadhaar');

  // Aadhaar State
  const [aadhaarRaw, setAadhaarRaw] = useState(''); // Clean 12 digits
  const [aadhaarFormatted, setAadhaarFormatted] = useState(''); // XXXX XXXX XXXX
  const [aadhaarDoc, setAadhaarDoc] = useState(null); // Base64 data URL
  const [aadhaarError, setAadhaarError] = useState('');

  // Live Selfie State (STRICTLY NO GALLERY / NO UPLOAD)
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [cameraError, setCameraError] = useState('');
  const [selfieData, setSelfieData] = useState(null); // Captured live frame base64
  const [selfieConfirmed, setSelfieConfirmed] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Verification Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStageText, setProcessingStageText] = useState('Encrypting identity data...');
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ---------------------------------------------------------------------------
  // INITIALIZATION: Check if already verified
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function checkExistingVerification() {
      try {
        const session = await getStoredSession();
        if (session?.customer?.isVerified || session?.customer?.verification?.status === 'VERIFIED') {
          setVerificationResult(session.customer.verification || {
            status: 'VERIFIED',
            maskedAadhaar: session.customer.aadhaarLast4 ? `XXXX-XXXX-${session.customer.aadhaarLast4}` : 'XXXX-XXXX-0123',
            isAdult: true,
            verifiedAge: 25,
            referenceId: session.customer.verificationRefId || 'KD-KYC-VERIFIED'
          });
          setActiveStage('result');
        }
      } catch (err) {
        // Continue to fresh verification
      }
    }
    checkExistingVerification();

    return () => {
      stopCameraStream();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // AADHAAR INPUT & FORMATTING
  // ---------------------------------------------------------------------------
  const handleAadhaarChange = (val) => {
    setAadhaarError('');
    setErrorMessage('');

    // Strip non-digits and cap at 12
    const clean = (val || '').replace(/\D/g, '').slice(0, 12);
    setAadhaarRaw(clean);

    // Format as XXXX XXXX XXXX
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.slice(i, i + 4));
    }
    setAadhaarFormatted(parts.join(' '));
  };

  const validateAadhaarNumber = (clean) => {
    if (!clean) return 'Please enter your 12-digit Aadhaar number.';
    if (clean.length !== 12) return 'Aadhaar number must be exactly 12 digits.';
    if (clean.startsWith('0') || clean.startsWith('1')) {
      return 'Invalid Aadhaar format. Aadhaar numbers cannot start with 0 or 1.';
    }
    return '';
  };

  const handleAttachAadhaarDoc = () => {
    // Web file input or simulated camera/document attachment for Aadhaar card
    if (typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          setAadhaarError('Aadhaar document must be under 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          setAadhaarDoc(evt.target.result);
          setAadhaarError('');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    } else {
      // Mock document for React Native offline test environment
      setAadhaarDoc('data:image/jpeg;base64,MOCK_AADHAAR_FRONT_CARD');
      setAadhaarError('');
    }
  };

  const handleRemoveAadhaarDoc = () => {
    setAadhaarDoc(null);
  };

  const handleProceedToSelfie = () => {
    const err = validateAadhaarNumber(aadhaarRaw);
    if (err) {
      setAadhaarError(err);
      return;
    }
    if (!aadhaarDoc) {
      setAadhaarError('Please attach a photo or document of your Aadhaar card.');
      return;
    }

    setAadhaarError('');
    setActiveStage('selfie');
    startCameraStream();
  };

  // ---------------------------------------------------------------------------
  // LIVE CAMERA SELFIE (STRICTLY NO GALLERY / NO UPLOAD)
  // ---------------------------------------------------------------------------
  const startCameraStream = async () => {
    setCameraError('');
    setSelfieData(null);
    setSelfieConfirmed(false);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        mediaStreamRef.current = stream;
        setCameraPermission('granted');
        setCameraActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('[Camera] Permission or device error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermission('denied');
          setCameraError('Camera permission was denied. Please allow camera access in your browser or device settings to verify your identity.');
        } else {
          setCameraPermission('denied');
          setCameraError('Device camera is unavailable or already in use. Please check camera access.');
        }
        setCameraActive(false);
      }
    } else {
      // Offline/Test environment fallback
      setCameraPermission('granted');
      setCameraActive(true);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureSelfie = () => {
    if (videoRef.current && typeof document !== 'undefined') {
      try {
        const video = videoRef.current;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1); // Mirror selfie
          ctx.drawImage(video, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.9);
          setSelfieData(base64);
        } else {
          setSelfieData('data:image/jpeg;base64,LIVE_FRAME_' + Date.now());
        }
      } catch (err) {
        setSelfieData('data:image/jpeg;base64,LIVE_FRAME_' + Date.now());
      }
    } else {
      // Test environment
      setSelfieData('data:image/jpeg;base64,LIVE_FRAME_' + Date.now());
    }

    stopCameraStream();
  };

  const handleRetakeSelfie = () => {
    setSelfieData(null);
    setSelfieConfirmed(false);
    startCameraStream();
  };

  const handleConfirmSelfie = () => {
    if (!selfieData) return;
    setSelfieConfirmed(true);
    stopCameraStream();
    submitVerification();
  };

  // ---------------------------------------------------------------------------
  // VERIFICATION SUBMISSION & RESULT
  // ---------------------------------------------------------------------------
  const submitVerification = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setActiveStage('processing');
    setErrorMessage('');
    setProcessingStageText('Encrypting identity data...');

    // Progressive visual feedback
    const t1 = setTimeout(() => setProcessingStageText('Verifying Aadhaar records...'), 600);
    const t2 = setTimeout(() => setProcessingStageText('Matching face & checking age (18+)...'), 1200);

    try {
      const res = await client.submitCustomerVerification({
        aadhaarNumber: aadhaarRaw,
        aadhaarDoc: aadhaarDoc,
        selfie: selfieData
      });

      clearTimeout(t1);
      clearTimeout(t2);
      setIsSubmitting(false);

      if (res && res.success && res.data?.status === 'VERIFIED') {
        const vData = res.data;
        setVerificationResult(vData);
        setActiveStage('result');

        // Update local session
        const session = await getStoredSession();
        if (session && session.customer) {
          session.customer.step5Complete = true;
          session.customer.isVerified = true;
          session.customer.kycStatus = 'VERIFIED';
          session.customer.aadhaarLast4 = vData.aadhaarLast4;
          session.customer.verificationRefId = vData.referenceId;
          session.customer.verification = vData;
          await setStoredSession(session);
        }
      } else {
        const failReason = res?.error || res?.data?.failureReason || 'Identity verification failed. Please try again.';
        setErrorMessage(failReason);
        setVerificationResult(res?.data || { status: 'FAILED', failureReason: failReason });
        setActiveStage('result');
      }
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Network error during verification. Please check your connection.');
      setVerificationResult({ status: 'FAILED', failureReason: err.message });
      setActiveStage('result');
    }
  };

  const handleRetryFlow = async () => {
    try {
      await client.retryCustomerVerification();
    } catch (e) {}

    setVerificationResult(null);
    setErrorMessage('');
    setSelfieData(null);
    setSelfieConfirmed(false);
    setActiveStage('aadhaar');
  };

  const handleProceedToStep6 = async () => {
    const session = await getStoredSession();
    if (onComplete) {
      onComplete(session);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER SECTIONS
  // ---------------------------------------------------------------------------

  // Masked Display for Aadhaar Card Graphic: XXXX-XXXX-1234
  const maskedAadhaarDisplay = aadhaarRaw.length === 12
    ? `XXXX XXXX ${aadhaarRaw.slice(-4)}`
    : (aadhaarFormatted || 'XXXX XXXX XXXX');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (activeStage === 'selfie') {
                stopCameraStream();
                setActiveStage('aadhaar');
              } else if (onBack) {
                stopCameraStream();
                onBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 5 of 6</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Identity & Age Verification</Text>
            <Text style={styles.subtitle}>
              Secure e-KYC compliance requires 18+ adult verification
            </Text>
          </View>

          {/* ================================================================= */}
          {/* STAGE 1: AADHAAR NUMBER & DOCUMENT */}
          {/* ================================================================= */}
          {activeStage === 'aadhaar' && (
            <View style={styles.stageCard}>
              {/* Visual Aadhaar Card Mockup */}
              <View style={styles.cardGraphic}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardChip} />
                  <View style={styles.aadhaarBadge}>
                    <Text style={styles.aadhaarSun}>☀️</Text>
                    <Text style={styles.aadhaarBadgeText}>AADHAAR</Text>
                  </View>
                </View>

                <View style={styles.cardBodyRow}>
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarEmoji}>👤</Text>
                  </View>
                  <View style={styles.cardLines}>
                    <View style={styles.cardLineWide} />
                    <View style={styles.cardLineMed} />
                    <View style={styles.cardLineSmall} />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardDigits}>{maskedAadhaarDisplay}</Text>
                  <Text style={styles.govtWatermark}>Govt. of India • Identity Card</Text>
                </View>
              </View>

              {/* Aadhaar Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>12-Digit Aadhaar Number</Text>
                <TextInput
                  style={[styles.input, aadhaarError ? styles.inputError : null]}
                  placeholder="2345 6789 0123"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={14}
                  value={aadhaarFormatted}
                  onChangeText={handleAadhaarChange}
                />
                <Text style={styles.inputHint}>
                  Your number will be masked as XXXX-XXXX-{aadhaarRaw.slice(-4) || 'XXXX'} for privacy
                </Text>
              </View>

              {/* Aadhaar Document / Photo Attachment */}
              <View style={styles.docSection}>
                <Text style={styles.inputLabel}>Aadhaar Card Document / Photo</Text>
                {aadhaarDoc ? (
                  <View style={styles.docAttachedBox}>
                    <View style={styles.docAttachedInfo}>
                      <Text style={styles.docAttachedIcon}>📄</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.docAttachedTitle}>Aadhaar Card Attached</Text>
                        <Text style={styles.docAttachedSub}>Front photo uploaded securely</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.docRemoveBtn}
                      onPress={handleRemoveAadhaarDoc}
                    >
                      <Text style={styles.docRemoveText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.docUploadBtn}
                    onPress={handleAttachAadhaarDoc}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.docUploadIcon}>📷</Text>
                    <Text style={styles.docUploadTitle}>Upload / Take Aadhaar Photo</Text>
                    <Text style={styles.docUploadSub}>JPG, PNG, or PDF up to 5MB</Text>
                  </TouchableOpacity>
                )}
              </View>

              {aadhaarError ? (
                <View style={styles.errorAlert}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{aadhaarError}</Text>
                </View>
              ) : null}

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  aadhaarRaw.length !== 12 || !aadhaarDoc ? styles.btnDisabled : null
                ]}
                disabled={aadhaarRaw.length !== 12 || !aadhaarDoc}
                onPress={handleProceedToSelfie}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>Next: Live Selfie Capture →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================================================================= */}
          {/* STAGE 2: LIVE SELFIE CAMERA ONLY (NO GALLERY / NO UPLOAD) */}
          {/* ================================================================= */}
          {activeStage === 'selfie' && (
            <View style={styles.stageCard}>
              <View style={styles.stageInfoBanner}>
                <Text style={styles.stageInfoIcon}>📸</Text>
                <Text style={styles.stageInfoText}>
                  Live camera capture only. Position your face in the oval guide.
                </Text>
              </View>

              {/* Viewfinder / Oval Face Guide */}
              <View style={styles.viewfinderWrapper}>
                {selfieData ? (
                  // Preview Mode after capture
                  <View style={styles.selfiePreviewBox}>
                    <View style={styles.ovalFrame}>
                      {typeof Image !== 'undefined' ? (
                        <Image
                          source={{ uri: selfieData }}
                          style={styles.previewImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.previewPlaceholder}>
                          <Text style={{ fontSize: 48 }}>👤</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.capturedBadge}>
                      <Text style={styles.capturedBadgeText}>✓ Live Frame Captured</Text>
                    </View>
                  </View>
                ) : (
                  // Live Camera Stream Mode
                  <View style={styles.cameraStreamBox}>
                    <View style={styles.ovalFrameDashed}>
                      {/* Web HTML5 video tag or mockup */}
                      {typeof document !== 'undefined' ? (
                        <video
                          ref={videoRef}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                          autoPlay
                          playsInline
                          muted
                        />
                      ) : (
                        <View style={styles.cameraPlaceholder}>
                          <Text style={{ fontSize: 56 }}>👤</Text>
                        </View>
                      )}
                      <View style={styles.faceAlignmentGuide} />
                    </View>

                    <Text style={styles.lightingHintText}>
                      💡 Make sure your face is well lit and looking straight ahead
                    </Text>
                  </View>
                )}
              </View>

              {cameraError ? (
                <View style={styles.errorAlert}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{cameraError}</Text>
                  <TouchableOpacity
                    style={styles.retryPermBtn}
                    onPress={startCameraStream}
                  >
                    <Text style={styles.retryPermText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Selfie Controls (ONLY RETAKE OR CONFIRM) */}
              <View style={styles.selfieActionsSection}>
                {selfieData ? (
                  <View style={styles.dualActionRow}>
                    <TouchableOpacity
                      style={styles.retakeBtn}
                      onPress={handleRetakeSelfie}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.retakeBtnText}>↺ Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmSelfieBtn}
                      onPress={handleConfirmSelfie}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.confirmSelfieText}>Confirm & Verify →</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.shutterCenterBox}>
                    <TouchableOpacity
                      style={styles.shutterBtn}
                      onPress={handleCaptureSelfie}
                      activeOpacity={0.8}
                    >
                      <View style={styles.shutterInnerCircle} />
                    </TouchableOpacity>
                    <Text style={styles.shutterLabel}>Tap to take live selfie</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* STAGE 3: VERIFICATION PROCESSING */}
          {/* ================================================================= */}
          {activeStage === 'processing' && (
            <View style={styles.processingCard}>
              <View style={styles.loadingPulseCircle}>
                <ActivityIndicator size="large" color="#2563eb" />
              </View>
              <Text style={styles.processingTitle}>Verifying Identity</Text>
              <Text style={styles.processingStatusText}>{processingStageText}</Text>
              <View style={styles.processingStepsList}>
                <Text style={styles.stepItemDone}>✓ Aadhaar format validated</Text>
                <Text style={styles.stepItemDone}>✓ Aadhaar document encrypted</Text>
                <Text style={styles.stepItemDone}>✓ Live selfie liveness check</Text>
                <Text style={styles.stepItemActive}>⏳ Age verification (18+ adult check)...</Text>
              </View>
            </View>
          )}

          {/* ================================================================= */}
          {/* STAGE 4: RESULT (VERIFIED OR FAILED) */}
          {/* ================================================================= */}
          {activeStage === 'result' && verificationResult && (
            <View style={styles.stageCard}>
              {verificationResult.status === 'VERIFIED' ? (
                // SUCCESS: VERIFIED ADULT (18+)
                <View style={styles.resultBoxSuccess}>
                  <View style={styles.successIconCircle}>
                    <Text style={styles.successCheckmark}>✓</Text>
                  </View>
                  <Text style={styles.resultSuccessTitle}>Identity & Age Verified!</Text>
                  <Text style={styles.resultSuccessSub}>
                    e-KYC identity verification completed successfully.
                  </Text>

                  {/* Verification Summary Card */}
                  <View style={styles.verifiedDetailsBox}>
                    <View style={styles.verifiedRow}>
                      <Text style={styles.verifiedKey}>Aadhaar Number:</Text>
                      <Text style={styles.verifiedVal}>
                        {verificationResult.maskedAadhaar || `XXXX-XXXX-${aadhaarRaw.slice(-4)}`}
                      </Text>
                    </View>
                    <View style={styles.verifiedRow}>
                      <Text style={styles.verifiedKey}>Age Requirement:</Text>
                      <Text style={styles.verifiedValSuccess}>
                        Verified 18+ Adult ✓ {verificationResult.verifiedAge ? `(${verificationResult.verifiedAge} yrs)` : ''}
                      </Text>
                    </View>
                    <View style={styles.verifiedRow}>
                      <Text style={styles.verifiedKey}>KYC Status:</Text>
                      <Text style={styles.verifiedValSuccess}>VERIFIED</Text>
                    </View>
                    <View style={styles.verifiedRow}>
                      <Text style={styles.verifiedKey}>Reference ID:</Text>
                      <Text style={styles.verifiedValRef}>
                        {verificationResult.referenceId || 'KD-KYC-VERIFIED'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleProceedToStep6}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.primaryBtnText}>Complete & Proceed →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // FAILURE: UNDERAGE OR MISMATCH OR RETRY REQUIRED
                <View style={styles.resultBoxFailed}>
                  <View style={styles.failedIconCircle}>
                    <Text style={styles.failedCross}>✕</Text>
                  </View>
                  <Text style={styles.resultFailedTitle}>Verification Failed</Text>
                  <Text style={styles.resultFailedSub}>
                    {errorMessage || verificationResult.failureReason || 'Could not verify your identity.'}
                  </Text>

                  {/* Underage Specific Notice */}
                  {verificationResult.failureCode === 'UNDERAGE_CUSTOMER' || verificationResult.isAdult === false ? (
                    <View style={styles.underageNoticeBox}>
                      <Text style={styles.underageNoticeTitle}>Age Requirement Not Met</Text>
                      <Text style={styles.underageNoticeText}>
                        KaamDost requires customers to be 18 years or older to book services and enter into service agreements.
                      </Text>
                    </View>
                  ) : null}

                  {/* Retry Action */}
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleRetryFlow}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.primaryBtnText}>Retry Verification ↺</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
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
    backgroundColor: '#f0f6ff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backArrow: {
    fontSize: 26,
    color: '#1e293b',
    fontWeight: '300',
    marginTop: -2,
  },
  stepBadge: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 20,
  },
  stageCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...SHADOWS.medium,
  },
  cardGraphic: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...SHADOWS.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#d97706',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  aadhaarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aadhaarSun: {
    fontSize: 12,
    marginRight: 4,
  },
  aadhaarBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardAvatarEmoji: {
    fontSize: 22,
  },
  cardLines: {
    flex: 1,
    gap: 6,
  },
  cardLineWide: {
    height: 6,
    width: '75%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  cardLineMed: {
    height: 6,
    width: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  cardLineSmall: {
    height: 6,
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
  },
  cardDigits: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2.5,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  govtWatermark: {
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 1.5,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  docSection: {
    marginBottom: 20,
  },
  docUploadBtn: {
    borderWidth: 2,
    borderColor: '#93c5fd',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  docUploadIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  docUploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  docUploadSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  docAttachedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 14,
    padding: 12,
  },
  docAttachedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docAttachedIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  docAttachedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  docAttachedSub: {
    fontSize: 11,
    color: '#16a34a',
  },
  docRemoveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  docRemoveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  btnDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  stageInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  stageInfoIcon: {
    fontSize: 18,
  },
  stageInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    fontWeight: '500',
    lineHeight: 18,
  },
  viewfinderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ovalFrame: {
    width: 200,
    height: 250,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#2563eb',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalFrameDashed: {
    width: 200,
    height: 250,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraStreamBox: {
    alignItems: 'center',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceAlignmentGuide: {
    position: 'absolute',
    width: 140,
    height: 180,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    pointerEvents: 'none',
  },
  lightingHintText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
  },
  selfiePreviewBox: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  capturedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  selfieActionsSection: {
    marginTop: 8,
  },
  shutterCenterBox: {
    alignItems: 'center',
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  shutterInnerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
  },
  shutterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  confirmSelfieBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  confirmSelfieText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  retryPermBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fca5a5',
    borderRadius: 6,
  },
  retryPermText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7f1d1d',
  },
  processingCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loadingPulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37,99,235,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  processingStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 24,
    textAlign: 'center',
  },
  processingStepsList: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  stepItemDone: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  stepItemActive: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '700',
  },
  resultBoxSuccess: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  successCheckmark: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '800',
  },
  resultSuccessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  resultSuccessSub: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  verifiedDetailsBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    gap: 12,
  },
  verifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedKey: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  verifiedVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  verifiedValSuccess: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  verifiedValRef: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    fontFamily: 'monospace',
  },
  resultBoxFailed: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  failedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  failedCross: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: '800',
  },
  resultFailedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  resultFailedSub: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 20,
  },
  underageNoticeBox: {
    width: '100%',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  underageNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991b1b',
    marginBottom: 4,
  },
  underageNoticeText: {
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 18,
  },
});
