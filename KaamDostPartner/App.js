import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

LogBox.ignoreAllLogs();
import { ThemeProvider } from '../shared/theme/ThemeContext';
import PartnerLanguageScreen from './src/screens/PartnerLanguageScreen';
import PartnerLoginScreen from './src/screens/PartnerLoginScreen';
import PartnerRegisterScreen from './src/screens/PartnerRegisterScreen';
import PartnerAddressScreen from './src/screens/PartnerAddressScreen';
import PartnerKycScreen from './src/screens/PartnerKycScreen';
import PartnerAccountCompleteScreen from './src/screens/PartnerAccountCompleteScreen';
import PartnerDashboardScreen from './src/screens/PartnerDashboardScreen';
import PartnerEarningsScreen from './src/screens/PartnerEarningsScreen';
import PartnerProfileScreen from './src/screens/PartnerProfileScreen';
import PartnerSupportScreen from './src/screens/PartnerSupportScreen';

enableScreens();

const DEFAULT_PARTNER = {
  id: 'w1',
  workerId: 'w1',
  name: 'Ramesh Kumar',
  phone: '9849012345',
  trade: 'electrician',
  tradeName: 'Electrician (House Wiring)',
  rating: '4.9',
  reviewsCount: 142,
  jobsCompleted: 156,
  hoursWorked: 8.5,
  todayEarnings: 1450,
  walletBalance: 3200,
  kycVerified: true,
  city: 'Sangareddy',
  activeDuty: true
};

export default function App({ onSwitchToCustomer }) {
  // Direct access: defaults directly to partner dashboard for immediate duty & operations
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [partnerLang, setPartnerLang] = useState('te');
  const [partner, setPartner] = useState(DEFAULT_PARTNER);

  // Native Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen !== 'dashboard' && currentScreen !== 'login') {
        setCurrentScreen('dashboard');
        return true;
      }
      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [currentScreen]);

  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light_navy" storageKey="@kaamdost_partner_theme_id">
        <StatusBar barStyle="dark-content" backgroundColor="#F4F8FC" />
        <View style={styles.container}>
        {/* Step 1: Language Selection */}
        {currentScreen === 'language' && (
          <PartnerLanguageScreen
            onContinue={(lang) => {
            setPartnerLang(lang || 'te');
            setCurrentScreen('login');
          }}
          />
        )}

        {/* Step 2: Mobile Login + OTP */}
        {currentScreen === 'login' && (
          <PartnerLoginScreen
            lang={partnerLang}
            onLoginSuccess={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('dashboard');
            }}
            onGoToRegister={(data) => {
              setPartner(prev => ({ ...prev, ...data }));
              setCurrentScreen('register');
            }}
            onSwitchToCustomer={onSwitchToCustomer}
          />
        )}

        {/* Step 3: Trade & Profile Registration */}
        {currentScreen === 'register' && (
          <PartnerRegisterScreen
            lang={partnerLang}
            phone={partner?.phone || ''}
            onContinue={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('address');
            }}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        )}

        {/* Step 4: Service Base Address & Radius */}
        {currentScreen === 'address' && (
          <PartnerAddressScreen
            lang={partnerLang}
            partnerData={partner}
            onContinue={(addr) => {
              setPartner(prev => ({ ...prev, address: addr }));
              setCurrentScreen('kyc');
            }}
            onBack={() => setCurrentScreen('register')}
          />
        )}

        {/* Step 5: Aadhaar e-KYC & Live Selfie */}
        {currentScreen === 'kyc' && (
          <PartnerKycScreen
            lang={partnerLang}
            partnerData={partner}
            onKycApproved={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('accountComplete');
            }}
            onBack={() => setCurrentScreen('address')}
          />
        )}

        {/* Step 6: 6-Point Onboarding Checklist Complete */}
        {currentScreen === 'accountComplete' && (
          <PartnerAccountCompleteScreen
            lang={partnerLang}
            partner={partner}
            onProceedDashboard={() => {
              setPartner(prev => ({ ...prev, registered: true }));
              setCurrentScreen('dashboard');
            }}
          />
        )}

        {/* Main Partner Dashboard & Workspace */}
        {currentScreen === 'dashboard' && (
          <PartnerDashboardScreen
            partner={partner}
            onOpenEarnings={() => setCurrentScreen('earnings')}
            onOpenProfile={() => setCurrentScreen('profile')}
            onOpenSupport={() => setCurrentScreen('support')}
            onLogout={() => setCurrentScreen('language')}
          />
        )}

        {currentScreen === 'earnings' && (
          <PartnerEarningsScreen onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'profile' && (
          <PartnerProfileScreen
            partner={partner}
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={() => setCurrentScreen('language')}
            onRestartOnboarding={() => setCurrentScreen('language')}
          />
        )}

        {currentScreen === 'support' && (
          <PartnerSupportScreen onBack={() => setCurrentScreen('dashboard')} />
        )}
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FC'
  }
});
