import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider } from '../shared/theme/ThemeContext';
import PartnerLoginScreen from './src/screens/PartnerLoginScreen';
import PartnerRegisterScreen from './src/screens/PartnerRegisterScreen';
import PartnerKycScreen from './src/screens/PartnerKycScreen';
import PartnerDashboardScreen from './src/screens/PartnerDashboardScreen';
import PartnerEarningsScreen from './src/screens/PartnerEarningsScreen';
import PartnerProfileScreen from './src/screens/PartnerProfileScreen';
import PartnerSupportScreen from './src/screens/PartnerSupportScreen';

enableScreens();

export default function App({ onSwitchToCustomer }) {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [partner, setPartner] = useState({
    id: 'w_101',
    name: 'Raju Kumar',
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
        {currentScreen === 'login' && (
          <PartnerLoginScreen
            onLoginSuccess={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('dashboard');
            }}
            onGoToRegister={() => setCurrentScreen('register')}
            onSwitchToCustomer={onSwitchToCustomer}
          />
        )}

        {currentScreen === 'register' && (
          <PartnerRegisterScreen
            onContinue={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('kyc');
            }}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'kyc' && (
          <PartnerKycScreen
            partnerData={partner}
            onKycApproved={(p) => {
              setPartner(prev => ({ ...prev, ...p }));
              setCurrentScreen('dashboard');
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <PartnerDashboardScreen
            partner={partner}
            onOpenEarnings={() => setCurrentScreen('earnings')}
            onOpenProfile={() => setCurrentScreen('profile')}
            onOpenSupport={() => setCurrentScreen('support')}
            onLogout={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'earnings' && (
          <PartnerEarningsScreen onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'profile' && (
          <PartnerProfileScreen
            partner={partner}
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={() => setCurrentScreen('login')}
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
