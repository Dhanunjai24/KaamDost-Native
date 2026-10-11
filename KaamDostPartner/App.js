import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function App({ onSwitchToCustomer }) {
  const [currentScreen, setCurrentScreen] = useState('language');
  const [partnerLang, setPartnerLang] = useState('te');
  const [partner, setPartner] = useState(null);

  // Restore existing registered partner session on launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem('@kaamdost_partner_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const isRegistered = parsed && (parsed.id || parsed.workerId || parsed.phone) && (
            parsed.registered === true ||
            parsed.trade ||
            parsed.tradeName ||
            parsed.name
          );

          if (isRegistered) {
            setPartner(parsed);
            setCurrentScreen('dashboard');
            return;
          }
        }
      } catch (e) {}
    };
    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@kaamdost_partner_user');
    } catch (_) {}
    setPartner(null);
    setCurrentScreen('language');
  };


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
              const fullPartner = { ...(partner || {}), ...p, registered: true };
              setPartner(fullPartner);
              AsyncStorage.setItem('@kaamdost_partner_user', JSON.stringify(fullPartner)).catch(() => {});
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
              const fullPartner = { ...partner, registered: true };
              setPartner(fullPartner);
              AsyncStorage.setItem('@kaamdost_partner_user', JSON.stringify(fullPartner)).catch(() => {});
              try {
                AsyncStorage.getItem('@kaamdost_registered_partners').then(regStr => {
                  const map = regStr ? JSON.parse(regStr) : {};
                  if (fullPartner.phone) {
                    map[fullPartner.phone] = fullPartner;
                    AsyncStorage.setItem('@kaamdost_registered_partners', JSON.stringify(map)).catch(() => {});
                  }
                });
              } catch (_) {}
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
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'earnings' && (
          <PartnerEarningsScreen onBack={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'profile' && (
          <PartnerProfileScreen
            partner={partner}
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={handleLogout}
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
