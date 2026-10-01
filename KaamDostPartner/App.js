import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PartnerLoginScreen from './src/screens/PartnerLoginScreen';
import PartnerRegisterScreen from './src/screens/PartnerRegisterScreen';
import PartnerKycScreen from './src/screens/PartnerKycScreen';
import PartnerDashboardScreen from './src/screens/PartnerDashboardScreen';
import PartnerEarningsScreen from './src/screens/PartnerEarningsScreen';
import PartnerProfileScreen from './src/screens/PartnerProfileScreen';
import PartnerSupportScreen from './src/screens/PartnerSupportScreen';

export default function App({ onSwitchToCustomer }) {
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

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
