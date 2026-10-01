import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

// Step 1: Language Selection
import LanguageSelectScreen from './src/screens/LanguageSelectScreen';
// Step 2: Mobile Number + OTP Login Screens
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
// Step 3: Customer Registration Screen (New Customers)
import CustomerRegisterScreen from './src/screens/CustomerRegisterScreen';
// Step 4: Customer Gender + Service Address Screen
import CustomerStep4Screen from './src/screens/CustomerStep4Screen';
// Step 5: Customer Aadhaar + Live Selfie Verification Screen
import CustomerStep5Screen from './src/screens/CustomerStep5Screen';
// Step 6: Customer Account Completion Screen
import AccountCompleteScreen from './src/screens/AccountCompleteScreen';

import {
  getStoredLanguage,
  clearStoredLanguage,
  getStoredSession,
  clearStoredSession,
} from '../shared/storage/storage';
import { setLanguage } from '../shared/i18n';
import { getLanguageByCode } from '../shared/i18n/languages';
import { COLORS, SHADOWS } from '../shared/theme/theme';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState(null);
  const [session, setSession] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('loading'); // 'language' | 'mobileLogin' | 'otpVerify' | 'register' | 'step4' | 'step5' | 'step6' | 'authenticated'
  const [mobileNumber, setMobileNumber] = useState('');
  const [registrationToken, setRegistrationToken] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  // 1. Startup Flow Check: Language -> Session Authentication
  useEffect(() => {
    async function initApp() {
      try {
        const storedLang = await getStoredLanguage();
        if (!storedLang) {
          // Flow: If language not selected -> Preferred Language Screen
          setCurrentScreen('language');
          return;
        }

        setPreferredLanguage(storedLang);
        setLanguage(storedLang);

        // Flow: Check Authentication
        const storedSession = await getStoredSession();
        if (storedSession && storedSession.customer?.authenticated) {
          setSession(storedSession);
          // Flow Rule: Step 4 missing -> Step 4; Step 5 missing -> Step 5; Step 6 missing -> Step 6; Complete -> Authenticated
          const isStep4Done = Boolean(storedSession.customer?.step4Complete);
          const isStep5Done = Boolean(storedSession.customer?.step5Complete || storedSession.customer?.isVerified);
          const isStep6Done = Boolean(storedSession.customer?.step6Complete || storedSession.customer?.accountCompleted);
          if (!isStep4Done) {
            setCurrentScreen('step4');
          } else if (!isStep5Done) {
            setCurrentScreen('step5');
          } else if (!isStep6Done) {
            setCurrentScreen('step6');
          } else {
            setCurrentScreen('authenticated');
          }
        } else {
          // Flow: Language already selected -> Mobile Number Login
          setCurrentScreen('mobileLogin');
        }
      } catch (err) {
        console.warn('[Startup] Initialization error:', err);
        setCurrentScreen('language');
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, []);

  // Step 1 -> Step 2 transition
  const handleLanguageSelected = (code) => {
    setPreferredLanguage(code);
    setLanguage(code);
    setCurrentScreen('mobileLogin');
  };

  // Step 2: Mobile Login -> OTP Verification
  const handleOtpSent = ({ phone, devOtp: receivedDevOtp }) => {
    setMobileNumber(phone);
    setDevOtp(receivedDevOtp);
    setCurrentScreen('otpVerify');
  };

  // Step 3 & Step 4: OTP Verification Decision (New vs. Existing Customer)
  const handleVerifySuccess = (result) => {
    if (result.isNewCustomer) {
      // NEW CUSTOMER: Branch to Step 3 Registration Screen
      setRegistrationToken(result.registrationToken);
      setCurrentScreen('register');
    } else {
      // EXISTING CUSTOMER:
      const cust = result.customer || result.data || {};
      setSession({ customer: result.customer, token: result.token });

      // Section 1 & 31: Check whether required Step 4 & Step 5 information exists
      const isComplete = Boolean(result.step4Complete || cust.step4Complete);
      const isStep4Done = isComplete;
      const isStep5Done = Boolean(result.step5Complete || cust.step5Complete || cust.isVerified);
      const isStep6Done = Boolean(result.step6Complete || cust.step6Complete || cust.accountCompleted);
      if (!isStep4Done) {
        setCurrentScreen('step4');
      } else if (!isStep5Done) {
        setCurrentScreen('step5');
      } else if (!isStep6Done) {
        setCurrentScreen('step6');
      } else {
        setCurrentScreen('authenticated');
      }
    }
  };

  // Step 3: Registration Success -> New Customer Account Created -> Step 4
  const handleRegisterSuccess = (sessionData) => {
    setSession(sessionData);
    setCurrentScreen('step4');
  };

  // Step 4: Gender + Service Address Saved Successfully -> Step 5 (Identity Verification)
  const handleStep4Complete = (updatedSession) => {
    setSession(updatedSession);
    setCurrentScreen('step5');
  };

  // Step 5: Aadhaar + Live Selfie Verified Successfully -> Step 6 (Account Completion Checklist)
  const handleStep5Complete = (verifiedSession) => {
    setSession(verifiedSession);
    setCurrentScreen('step6');
  };

  // Step 6: All 5 Requirements Verified -> Account Complete
  const handleStep6Complete = (completedSession) => {
    if (completedSession) {
      setSession(completedSession);
    }
    setCurrentScreen('authenticated');
  };

  // Step 2: Change Mobile Number (preserves mobile number)
  const handleChangeMobile = () => {
    setCurrentScreen('mobileLogin');
  };

  // Logout / Invalidate Session (Section 19)
  const handleLogout = async () => {
    await clearStoredSession();
    setSession(null);
    setDevOtp(null);
    setRegistrationToken(null);
    setCurrentScreen('mobileLogin');
  };

  // Reset Everything for fresh onboarding testing (Test 6)
  const handleResetForTesting = async () => {
    await clearStoredSession();
    await clearStoredLanguage();
    setSession(null);
    setPreferredLanguage(null);
    setMobileNumber('');
    setDevOtp(null);
    setRegistrationToken(null);
    setCurrentScreen('language');
  };

  // Loading Indicator during initial storage read
  if (loading || currentScreen === 'loading') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
        <View style={styles.loadingBox}>
          <Text style={styles.loadingLogo}>KD</Text>
          <ActivityIndicator size="small" color="#2563eb" style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  // 1. Language Selection Screen
  if (currentScreen === 'language') {
    return (
      <LanguageSelectScreen
        onContinue={handleLanguageSelected}
      />
    );
  }

  // 2. Mobile Number Login Screen
  if (currentScreen === 'mobileLogin') {
    return (
      <PhoneLoginScreen
        initialPhone={mobileNumber}
        onOtpSent={handleOtpSent}
        onBack={() => setCurrentScreen('language')}
      />
    );
  }

  // 3. OTP Verification Screen
  if (currentScreen === 'otpVerify') {
    return (
      <OtpVerificationScreen
        phone={mobileNumber}
        devOtp={devOtp}
        onVerifySuccess={handleVerifySuccess}
        onChangeMobile={handleChangeMobile}
        onBack={handleChangeMobile}
      />
    );
  }

  // 4. Step 3: Customer Registration Screen (New Customers Only)
  if (currentScreen === 'register') {
    return (
      <CustomerRegisterScreen
        phone={mobileNumber}
        registrationToken={registrationToken}
        onRegisterSuccess={handleRegisterSuccess}
        onBack={() => setCurrentScreen('otpVerify')}
      />
    );
  }

  // 5. Step 4: Customer Gender + Service Address Screen
  if (currentScreen === 'step4') {
    const cust = session?.customer || {};
    const addresses = Array.isArray(cust.savedAddresses) ? cust.savedAddresses : [];

    return (
      <CustomerStep4Screen
        initialGender={cust.gender || ''}
        initialAddresses={addresses}
        onComplete={handleStep4Complete}
        onBack={() => {
          if (registrationToken) {
            setCurrentScreen('register');
          } else {
            handleLogout();
          }
        }}
      />
    );
  }

  // 6. Step 5: Customer Aadhaar + Live Selfie Verification Screen
  if (currentScreen === 'step5') {
    return (
      <CustomerStep5Screen
        onComplete={handleStep5Complete}
        onBack={() => setCurrentScreen('step4')}
      />
    );
  }

  // 7. Step 6: Customer Account Completion Checklist Screen
  if (currentScreen === 'step6') {
    return (
      <AccountCompleteScreen
        onComplete={handleStep6Complete}
        onProceedHome={handleStep6Complete}
        onNavigateStep={(step) => setCurrentScreen(step)}
        onBack={() => setCurrentScreen('step5')}
      />
    );
  }

  // 8. Authenticated Customer Flow (All Onboarding Steps Completed)
  const currentLangObj = getLanguageByCode(preferredLanguage);
  const customer = session?.customer || {};

  return (
    <SafeAreaView style={styles.placeholderSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f6ff" />
      <ScrollView contentContainerStyle={styles.placeholderContainer}>
        {/* Brand Card */}
        <View style={styles.placeholderCard}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>KD</Text>
          </View>

          <Text style={styles.placeholderTitle}>Welcome to KaamDost</Text>
          <Text style={styles.placeholderSubtitle}>Customer Authenticated Successfully</Text>

          {/* Customer Session Identity Card (Section 17) */}
          <View style={styles.sessionBox}>
            <Text style={styles.sessionTitle}>Authenticated Customer Identity</Text>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>authenticated:</Text>
              <Text style={styles.sessionValSuccess}>true</Text>
            </View>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>customerId:</Text>
              <Text style={styles.sessionVal}>{customer.customerId || customer.id || 'N/A'}</Text>
            </View>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>fullName:</Text>
              <Text style={styles.sessionVal}>{customer.fullName || customer.name || 'N/A'}</Text>
            </View>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>mobileNumber:</Text>
              <Text style={styles.sessionVal}>+91 {customer.mobileNumber || customer.phone || mobileNumber}</Text>
            </View>

            {customer.email ? (
              <View style={styles.sessionRow}>
                <Text style={styles.sessionKey}>email:</Text>
                <Text style={styles.sessionVal}>{customer.email}</Text>
              </View>
            ) : null}

            {customer.referralCode ? (
              <View style={styles.sessionRow}>
                <Text style={styles.sessionKey}>referralCode:</Text>
                <Text style={styles.sessionVal}>{customer.referralCode}</Text>
              </View>
            ) : null}

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>phoneVerified:</Text>
              <Text style={styles.sessionValSuccess}>✓ Verified via OTP</Text>
            </View>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionKey}>language:</Text>
              <Text style={styles.sessionVal}>
                {currentLangObj ? `${currentLangObj.name} (${currentLangObj.code})` : preferredLanguage}
              </Text>
            </View>

            {customer.gender ? (
              <View style={styles.sessionRow}>
                <Text style={styles.sessionKey}>gender:</Text>
                <Text style={styles.sessionVal}>{customer.gender}</Text>
              </View>
            ) : null}

            {customer.savedAddresses && customer.savedAddresses.length > 0 ? (
              <View style={styles.sessionRow}>
                <Text style={styles.sessionKey}>serviceAddress:</Text>
                <Text style={styles.sessionVal} numberOfLines={1}>
                  {`${customer.savedAddresses[0].houseNumber || ''}, ${customer.savedAddresses[0].street || ''}, ${customer.savedAddresses[0].city || ''} - ${customer.savedAddresses[0].pincode || ''}`}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              ✓ Step 6 Complete • Account Verified & Active
            </Text>
          </View>
        </View>

        {/* Session Management & Test Controls (Section 19) */}
        <View style={styles.testControlCard}>
          <Text style={styles.testControlTitle}>Session & Testing Controls</Text>
          <Text style={styles.testControlDesc}>
            Test session persistence, invalidation, and logout flow.
          </Text>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>Logout Customer Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetForTesting}
            activeOpacity={0.8}
          >
            <Text style={styles.resetBtnText}>Clear All Data & Restart from Language</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f0f6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563eb',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    ...SHADOWS.sm,
  },
  placeholderSafeArea: {
    flex: 1,
    backgroundColor: '#f0f6ff',
  },
  placeholderContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.md,
    marginTop: 10,
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2563eb',
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f2c6e',
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#5f7da6',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0edfd',
    marginBottom: 16,
    ...SHADOWS.xs,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f2c6e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  sessionKey: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  sessionVal: {
    fontSize: 13,
    color: '#0f2c6e',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  sessionValSuccess: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
    marginTop: 8,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  testControlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...SHADOWS.sm,
  },
  testControlTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f2c6e',
    marginBottom: 6,
  },
  testControlDesc: {
    fontSize: 12,
    color: '#5f7da6',
    lineHeight: 18,
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b91c1c',
  },
  resetBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
});
