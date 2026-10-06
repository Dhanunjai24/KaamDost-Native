import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
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

export default function App({ onSwitchToCustomer }) {
  // Screen routing: language -> login -> register -> address -> kyc -> accountComplete -> dashboard
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [partner, setPartner] = useState({
    id: 'w_101',
    name: 'Ramesh Reddy',
    phone: '9848012345',
    trade: 'masonry',
    tradeName: 'Mason / Civil Work',
    dailyRate: 950,
    city: 'Sangareddy',
    experienceYears: 8,
    isVerified: true
  });

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
      <ThemeProvider initialTheme="slate_orange" storageKey="@kaamdost_partner_theme_id">
        <StatusBar barStyle="light-content" backgroundColor="#0B1320" />
        <View style={styles.container}>
        {/* Step 1: Language Selection */}
        {currentScreen === 'language' && (
          <PartnerLanguageScreen
            onContinue={(lang) => setCurrentScreen('login')}
          />
        )}

        {/* Step 2: Mobile Login + OTP */}
        {currentScreen === 'login' && (
          <PartnerLoginScreen
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
            phone={partner.phone}
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
            partner={partner}
            onProceedDashboard={() => setCurrentScreen('dashboard')}
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
    backgroundColor: '#0B1320'
  }
});
