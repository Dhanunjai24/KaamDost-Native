import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import client from '../../../shared/api/client';
import { getStoredSession, setStoredSession } from '../../../shared/storage/storage';
import { COLORS, SHADOWS } from '../../../shared/theme/theme';

export default function AccountCompleteScreen({
  onProceedHome,
  onComplete,
  onNavigateStep,
  onBack,
}) {
  const [loading, setLoading] = useState(true);
  const [checklistData, setChecklistData] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ---------------------------------------------------------------------------
  // INITIALIZATION: Fetch checklist status from backend
  // ---------------------------------------------------------------------------
  const fetchChecklist = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await client.getCustomerChecklist();
      if (res && res.success && res.data) {
        setChecklistData(res.data);
      } else {
        // Fallback to session data if network drops
        await buildFallbackChecklist();
      }
    } catch (err) {
      console.warn('[Step6] Error fetching checklist:', err);
      await buildFallbackChecklist();
    } finally {
      setLoading(false);
    }
  };

  const buildFallbackChecklist = async () => {
    try {
      const session = await getStoredSession();
      const cust = session?.customer || {};

      const cleanPhone = (cust.phone || cust.mobileNumber || '').toString().trim();
      const mobileVerified = !!(cleanPhone && /^\d{10}$/.test(cleanPhone.slice(-10)) && cust.phoneVerified !== false);
      const maskedMobile = cleanPhone ? `+91 ${cleanPhone.slice(-10, -4)}XXXX` : null;

      const nameStr = (cust.fullName || cust.name || '').toString().trim();
      const nameAdded = nameStr.length >= 2;

      const v = cust.verification;
      const aadhaarVerified = !!(v && v.status === 'VERIFIED' && (v.isAdult === true || cust.isVerified === true));
      const maskedAadhaar = v?.maskedAadhaar || (cust.aadhaarLast4 ? `XXXX-XXXX-${cust.aadhaarLast4}` : null);

      const hasAddresses = Array.isArray(cust.savedAddresses) && cust.savedAddresses.length > 0;
      const addressAdded = !!(hasAddresses || (cust.address && cust.city));
      const primaryAddr = hasAddresses ? (cust.savedAddresses.find(a => a.isDefault) || cust.savedAddresses[0]) : null;
      const addressDisplay = primaryAddr
        ? (primaryAddr.address || `${primaryAddr.houseNumber}, ${primaryAddr.street}, ${primaryAddr.city}`)
        : (cust.address || null);

      const photoVerified = !!(cust.hasPhoto === true || cust.photoVerified === true || (v && v.hasSelfie === true && v.status === 'VERIFIED') || cust.avatar);

      const allVerified = mobileVerified && nameAdded && aadhaarVerified && addressAdded && photoVerified;
      const verifiedCount = [mobileVerified, nameAdded, aadhaarVerified, addressAdded, photoVerified].filter(Boolean).length;

      setChecklistData({
        customerId: cust.id || cust.customerId,
        mobileVerified,
        nameAdded,
        aadhaarVerified,
        addressAdded,
        photoVerified,
        allVerified,
        verifiedCount,
        totalCount: 5,
        accountCompleted: cust.accountCompleted === true || cust.step6Complete === true,
        checklist: [
          { id: 'mobile', label: 'Mobile Verified', verified: mobileVerified, value: maskedMobile || 'Pending' },
          { id: 'name', label: 'Name Added', verified: nameAdded, value: nameAdded ? nameStr : 'Pending' },
          { id: 'aadhaar', label: 'Aadhaar Verified', verified: aadhaarVerified, value: aadhaarVerified ? `${maskedAadhaar || 'Verified'} (18+ Adult)` : 'Pending' },
          { id: 'address', label: 'Address', verified: addressAdded, value: addressAdded ? addressDisplay : 'Pending' },
          { id: 'photo', label: 'Photo', verified: photoVerified, value: photoVerified ? 'Live Selfie Verified ✓' : 'Pending' },
        ],
      });
    } catch (e) {
      setErrorMessage("Could not load account checklist. Please try again.");
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  // ---------------------------------------------------------------------------
  // COMPLETE ACCOUNT ACTION
  // ---------------------------------------------------------------------------
  const handleCompleteAccount = async () => {
    if (isCompleting) return;

    if (!checklistData || !checklistData.allVerified) {
      setErrorMessage('All 5 checklist items must be verified by the backend to activate your account.');
      return;
    }

    setIsCompleting(true);
    setErrorMessage('');

    try {
      const res = await client.completeCustomerAccount();
      setIsCompleting(false);

      if (res && res.success) {
        setSuccessMessage('Account setup 100% completed! Welcome to KaamDost.');

        // Update local session
        const session = await getStoredSession();
        if (session && session.customer) {
          session.customer.step6Complete = true;
          session.customer.accountCompleted = true;
          session.customer.accountStatus = 'ACTIVE';
          await setStoredSession(session);
        }

        // Navigate forward
        setTimeout(() => {
          if (onComplete) {
            onComplete(session);
          } else if (onProceedHome) {
            onProceedHome(session);
          }
        }, 600);
      } else {
        setErrorMessage(res?.error || 'Could not complete account setup. Please check all requirements.');
      }
    } catch (err) {
      setIsCompleting(false);
      setErrorMessage(err.message || 'Network error while completing account.');
    }
  };

  // ---------------------------------------------------------------------------
  // ACTION DISPATCHER FOR INCOMPLETE ITEMS
  // ---------------------------------------------------------------------------
  const handleItemAction = (itemId) => {
    if (!onNavigateStep) return;

    switch (itemId) {
      case 'mobile':
        onNavigateStep('otpVerify');
        break;
      case 'name':
        onNavigateStep('register');
        break;
      case 'aadhaar':
        onNavigateStep('step5');
        break;
      case 'address':
        onNavigateStep('step4');
        break;
      case 'photo':
        onNavigateStep('step5');
        break;
      default:
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------
  const verifiedCount = checklistData?.verifiedCount || 0;
  const totalCount = checklistData?.totalCount || 5;
  const progressPercent = Math.round((verifiedCount / totalCount) * 100);
  const isAllComplete = Boolean(checklistData?.allVerified);

  const checklistItems = checklistData?.checklist || [
    { id: 'mobile', label: 'Mobile Verified', verified: false, value: 'Pending' },
    { id: 'name', label: 'Name Added', verified: false, value: 'Pending' },
    { id: 'aadhaar', label: 'Aadhaar Verified', verified: false, value: 'Pending' },
    { id: 'address', label: 'Address', verified: false, value: 'Pending' },
    { id: 'photo', label: 'Photo', verified: false, value: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 6 of 6</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Title */}
          <View style={styles.header}>
            <View style={styles.headerIconBox}>
              <Text style={styles.headerEmoji}>🛡️</Text>
            </View>
            <Text style={styles.title}>Account Completion</Text>
            <Text style={styles.subtitle}>
              All five verification requirements must be confirmed by the backend to activate your account.
            </Text>
          </View>

          {/* Dynamic Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressTitle}>Onboarding Verification</Text>
              <View style={[styles.progressPill, isAllComplete ? styles.progressPillComplete : null]}>
                <Text style={[styles.progressPillText, isAllComplete ? styles.progressPillTextComplete : null]}>
                  {verifiedCount} of {totalCount} Verified ({progressPercent}%)
                </Text>
              </View>
            </View>

            {/* Progress Fill Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                  isAllComplete ? styles.progressBarFillComplete : null,
                ]}
              />
            </View>
          </View>

          {/* Loading Skeleton / Spinner */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.loadingText}>Syncing account verification status...</Text>
            </View>
          ) : (
            /* 5-Item Checklist Stack */
            <View style={styles.checklistCard}>
              {checklistItems.map((item, idx) => {
                const isVerified = Boolean(item.verified);
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.checkRow,
                      idx < checklistItems.length - 1 && styles.rowDivider,
                    ]}
                  >
                    {/* Checkbox Icon */}
                    <View style={[styles.checkCircle, isVerified ? styles.checkCircleDone : styles.checkCirclePending]}>
                      <Text style={[styles.checkMark, isVerified ? styles.checkMarkDone : styles.checkMarkPending]}>
                        {isVerified ? '✓' : '!'}
                      </Text>
                    </View>

                    {/* Content Detail */}
                    <View style={styles.itemContent}>
                      <View style={styles.itemTitleRow}>
                        <Text style={[styles.itemLabel, isVerified ? styles.itemLabelDone : styles.itemLabelPending]}>
                          {item.label}
                        </Text>
                        <View style={[styles.statusBadge, isVerified ? styles.statusBadgeDone : styles.statusBadgePending]}>
                          <Text style={[styles.statusText, isVerified ? styles.statusTextDone : styles.statusTextPending]}>
                            {isVerified ? 'Verified ✓' : 'Incomplete'}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[styles.itemValue, isVerified ? styles.itemValueDone : styles.itemValuePending]}
                        numberOfLines={1}
                      >
                        {item.value || (isVerified ? 'Completed' : 'Pending')}
                      </Text>
                    </View>

                    {/* Action Trigger for Incomplete items */}
                    {!isVerified && onNavigateStep && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleItemAction(item.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionBtnText}>Fix →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Feedback Messages */}
          {errorMessage ? (
            <View style={styles.errorAlert}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successAlert}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !isAllComplete || isCompleting ? styles.btnDisabled : null,
              ]}
              disabled={!isAllComplete || isCompleting}
              onPress={handleCompleteAccount}
              activeOpacity={0.88}
            >
              {isCompleting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {isAllComplete
                    ? 'Complete & Activate Account →'
                    : `Complete All 5 Requirements (${totalCount - verifiedCount} Remaining)`}
                </Text>
              )}
            </TouchableOpacity>

            {/* Refresh Verification Action */}
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={fetchChecklist}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.refreshBtnText}>↻ Refresh Verification Status</Text>
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
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.small,
  },
  headerEmoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...SHADOWS.small,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  progressPillComplete: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  progressPillTextComplete: {
    color: '#16a34a',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressBarFillComplete: {
    backgroundColor: '#16a34a',
  },
  loadingBox: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  checklistCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkCircleDone: {
    backgroundColor: '#dcfce7',
    borderWidth: 1.5,
    borderColor: '#22c55e',
  },
  checkCirclePending: {
    backgroundColor: '#fef3c7',
    borderWidth: 1.5,
    borderColor: '#f59e0b',
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '900',
  },
  checkMarkDone: {
    color: '#16a34a',
  },
  checkMarkPending: {
    color: '#d97706',
  },
  itemContent: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemLabelDone: {
    color: '#0f172a',
  },
  itemLabelPending: {
    color: '#334155',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeDone: {
    backgroundColor: '#f0fdf4',
  },
  statusBadgePending: {
    backgroundColor: '#fffbeb',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextDone: {
    color: '#16a34a',
  },
  statusTextPending: {
    color: '#b45309',
  },
  itemValue: {
    fontSize: 12,
  },
  itemValueDone: {
    color: '#64748b',
    fontWeight: '500',
  },
  itemValuePending: {
    color: '#dc2626',
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
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
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successIcon: {
    fontSize: 16,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: '#15803d',
    fontWeight: '700',
  },
  footer: {
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
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
  refreshBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  refreshBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
});
