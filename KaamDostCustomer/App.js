import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '../shared/theme/ThemeContext';
import LanguageSelectScreen from './src/screens/LanguageSelectScreen';
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import CustomerRegisterScreen from './src/screens/CustomerRegisterScreen';
import CustomerAddressScreen from './src/screens/CustomerAddressScreen';
import CustomerAadhaarScreen from './src/screens/CustomerAadhaarScreen';
import AccountCompleteScreen from './src/screens/AccountCompleteScreen';
import CustomerHomeScreen from './src/screens/CustomerHomeScreen';
import FindWorkersScreen from './src/screens/FindWorkersScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import CustomerDashboardScreen from './src/screens/CustomerDashboardScreen';
import CustomerBookingsScreen from './src/screens/CustomerBookingsScreen';
import CustomerSupportScreen from './src/screens/CustomerSupportScreen';
import api from '../shared/api/client';
import { initLanguage } from '../shared/i18n';
import socketService from './src/services/socketService';
import realtimeService from '../shared/services/realtimeService';

enableScreens();

export default function App({ onSwitchToPartner }) {
  // Screen routing: language -> login -> register -> address -> aadhaar -> accountComplete -> home
  const [currentScreen, setCurrentScreen] = useState('language');
  const [customer, setCustomer] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [initialTradeFilter, setInitialTradeFilter] = useState('all');
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // Load existing session if previously logged in
  useEffect(() => {
    const loadSession = async () => {
      try {
        await initLanguage();
        const savedLang = await AsyncStorage.getItem('@kaamdost_language');

        const stored = await AsyncStorage.getItem('@kaamdost_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const isRegistered = parsed && (parsed.id || parsed.phone) && (
            parsed.isVerified === true ||
            parsed.isRegistered === true ||
            parsed.accountCompleted === true ||
            (parsed.name && parsed.name !== 'Customer') ||
            (parsed.fullName && parsed.fullName !== 'Customer')
          );

          if (isRegistered) {
            setCustomer(parsed);
            socketService.connect(parsed.id || parsed.phone);
            let restoredBooking = null;
            try {
              const storedBooking = await AsyncStorage.getItem('@kaamdost_active_booking');
              if (storedBooking) {
                const parsedBooking = JSON.parse(storedBooking);
                if (parsedBooking && parsedBooking.status !== 'COMPLETED' && parsedBooking.status !== 'CANCELLED') {
                  restoredBooking = parsedBooking;
                  setActiveBooking(parsedBooking);
                }
              }
            } catch (err) {}
            realtimeService.connect({
              userId: parsed.id || parsed.phone || 'cust_live',
              role: 'customer',
              bookingId: restoredBooking?.id || null
            });
            setCurrentScreen('home');
            return;
          } else if (parsed && parsed.phone) {
            setCustomer(parsed);
            setCurrentScreen('register');
            return;
          } else if (savedLang) {
            setCurrentScreen('login');
            return;
          }
        } else if (savedLang) {
          setCurrentScreen('login');
        }

        // Clean out any legacy default bookings from storage
        const storedHistory = await AsyncStorage.getItem('@kaamdost_booking_history');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            const cleanHistory = parsedHistory.filter(b => b.id !== 'BK-7821' && b.id !== 'BK-5409');
            await AsyncStorage.setItem('@kaamdost_booking_history', JSON.stringify(cleanHistory)).catch(() => {});
          }
        }
      } catch (e) {
        // Fall back to login screen
      }
    };
    loadSession();

    // Listen for partner acceptance via real-time gateway
    const unsubAccepted = realtimeService.on('booking_accepted', (data) => {
      if (data && data.worker) {
        setActiveBooking((prev) => {
          const updated = {
            ...(prev || {}),
            id: (prev && prev.id) || data.bookingId,
            workerId: data.workerId || data.worker.id,
            workerName: data.worker.name || (prev && prev.workerName) || 'Assigned Partner',
            workerPhone: data.worker.phone || (prev && prev.workerPhone) || '9848012345',
            workerRating: data.worker.rating || (prev && prev.workerRating) || '4.9',
            workerAvatar: data.worker.avatar || data.worker.selfieUri || (prev && prev.workerAvatar) || null,
            workerTrade: data.worker.trade || (prev && prev.workerTrade) || 'masonry',
            tradeName: data.worker.tradeName || (prev && prev.tradeName) || 'Specialist',
            status: 'ASSIGNED',
            assignedAt: new Date().toISOString()
          };
          AsyncStorage.setItem('@kaamdost_active_booking', JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }
    });

    const unsubStatus = realtimeService.on('job_status_updated', (data) => {
      if (data && data.status) {
        setActiveBooking((prev) => {
          if (!prev) return null;
          const updated = { ...prev, status: data.status };
          AsyncStorage.setItem('@kaamdost_active_booking', JSON.stringify(updated)).catch(() => {});
          return updated;
        });
      }
    });

    return () => {
      if (unsubAccepted) unsubAccepted();
      if (unsubStatus) unsubStatus();
    };
  }, []);

  const handleBookingCreated = (newBooking) => {
    setActiveBooking(newBooking);
    AsyncStorage.setItem('@kaamdost_active_booking', JSON.stringify(newBooking)).catch(() => {});
    socketService.connect(customer?.id || 'cust_live', newBooking?.id);
    realtimeService.connect({
      userId: customer?.id || customer?.phone || 'cust_live',
      role: 'customer',
      bookingId: newBooking?.id
    });
    realtimeService.bookOrder(newBooking);
    setCurrentScreen('tracking');
  };

  const handleCompleteBooking = async (completedBooking) => {
    if (completedBooking) {
      try {
        const stored = await AsyncStorage.getItem('@kaamdost_booking_history');
        const list = stored ? JSON.parse(stored) : [];
        const newHistoryItem = {
          id: completedBooking.id || ('BK-' + Math.floor(1000 + Math.random() * 9000)),
          tradeName: completedBooking.tradeName || 'Specialist',
          worker: completedBooking.workerName || 'Partner',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: completedBooking.totalAmount || 1045
        };
        await AsyncStorage.setItem('@kaamdost_booking_history', JSON.stringify([newHistoryItem, ...list]));
      } catch (e) {}
    }
    await AsyncStorage.removeItem('@kaamdost_active_booking').catch(() => {});
    setActiveBooking(null);
    setCurrentScreen('home');
  };

  const handleCancelBooking = async () => {
    await AsyncStorage.removeItem('@kaamdost_active_booking').catch(() => {});
    setActiveBooking(null);
    setCurrentScreen('home');
  };

  // Native Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      switch (currentScreen) {
        case 'home':
          return false; // Exit app
        case 'login':
          setCurrentScreen('language');
          return true;
        case 'register':
          setCurrentScreen('login');
          return true;
        case 'address':
          setCurrentScreen('register');
          return true;
        case 'aadhaar':
          setCurrentScreen('address');
          return true;
        case 'accountComplete':
          setCurrentScreen('home');
          return true;
        case 'findWorkers':
        case 'bookings':
        case 'tracking':
        case 'dashboard':
        case 'support':
          setCurrentScreen('home');
          return true;
        case 'language':
        default:
          return false;
      }
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [currentScreen]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.container}>
      {/* Step 1: Language Selection */}
      {currentScreen === 'language' && (
        <LanguageSelectScreen onContinue={() => setCurrentScreen('login')} />
      )}

      {/* Step 2: Mobile Number + OTP Login */}
      {currentScreen === 'login' && (
        <PhoneLoginScreen
          onLoginSuccess={async (user) => {
            setCustomer(user);
            socketService.connect(user.id || user.phone);
            await AsyncStorage.setItem('@kaamdost_user', JSON.stringify(user)).catch(() => {});
            let restoredBooking = null;
            try {
              const storedBooking = await AsyncStorage.getItem('@kaamdost_active_booking');
              if (storedBooking) {
                const parsedBooking = JSON.parse(storedBooking);
                if (parsedBooking && parsedBooking.status !== 'COMPLETED' && parsedBooking.status !== 'CANCELLED') {
                  restoredBooking = parsedBooking;
                  setActiveBooking(parsedBooking);
                }
              }
            } catch (err) {}
            realtimeService.connect({
              userId: user.id || user.phone || 'cust_live',
              role: 'customer',
              bookingId: restoredBooking?.id || null
            });
            setCurrentScreen('home');
          }}
          onGoToRegister={(data) => {
            setCustomer(prev => ({ ...(prev || {}), ...data }));
            setCurrentScreen('register');
          }}
          onSwitchRole={onSwitchToPartner}
        />
      )}

      {/* Step 3: Basic Profile Registration */}
      {currentScreen === 'register' && (
        <CustomerRegisterScreen
          phone={customer?.phone}
          customer={customer}
          onContinue={(data) => {
            setCustomer(prev => ({ ...(prev || {}), ...data }));
            setCurrentScreen('address');
          }}
        />
      )}

      {/* Step 4: Gender & Multiple Addresses */}
      {currentScreen === 'address' && (
        <CustomerAddressScreen
          onContinue={(data) => {
            setCustomer(prev => ({ ...prev, ...data }));
            setCurrentScreen('aadhaar');
          }}
        />
      )}

      {/* Step 5: Aadhaar Verification & Live Selfie */}
      {currentScreen === 'aadhaar' && (
        <CustomerAadhaarScreen
          onContinue={(data) => {
            setCustomer(prev => ({ ...prev, ...data }));
            setCurrentScreen('accountComplete');
          }}
        />
      )}

      {/* Step 6: 5-Point Checklist Account Completion */}
      {currentScreen === 'accountComplete' && (
        <AccountCompleteScreen
          customer={customer}
          onProceedHome={async () => {
            if (customer) {
              const fullVerifiedCustomer = {
                ...customer,
                isVerified: true,
                isKycComplete: true,
                aadhaarVerified: true
              };
              setCustomer(fullVerifiedCustomer);
              await AsyncStorage.setItem('@kaamdost_user', JSON.stringify(fullVerifiedCustomer)).catch(() => {});
              try {
                const regData = await AsyncStorage.getItem('@kaamdost_registered_customers');
                const regMap = regData ? JSON.parse(regData) : {};
                if (fullVerifiedCustomer.phone) {
                  regMap[fullVerifiedCustomer.phone] = fullVerifiedCustomer;
                  await AsyncStorage.setItem('@kaamdost_registered_customers', JSON.stringify(regMap));
                }
              } catch (e) {}
            }
            setCurrentScreen('home');
          }}
        />
      )}

      {/* Main Customer Portal */}
      {currentScreen === 'home' && (
        <CustomerHomeScreen
          customer={customer}
          activeBooking={activeBooking}
          onOpenFindWorkers={(tradeId, query) => {
            if (tradeId) setInitialTradeFilter(tradeId);
            else setInitialTradeFilter('all');
            if (query) setInitialSearchQuery(query);
            else setInitialSearchQuery('');
            setCurrentScreen('findWorkers');
          }}
          onOpenBookings={() => setCurrentScreen('bookings')}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onOpenSupport={() => setCurrentScreen('support')}
          onBookingCreated={handleBookingCreated}
          onUpdateCustomer={(updated) => setCustomer(updated)}
        />
      )}

      {currentScreen === 'findWorkers' && (
        <FindWorkersScreen
          initialTradeFilter={initialTradeFilter}
          initialSearchQuery={initialSearchQuery}
          customer={customer}
          onBack={() => setCurrentScreen('home')}
          onOpenHome={() => setCurrentScreen('home')}
          onOpenFindWorkers={() => setCurrentScreen('findWorkers')}
          onOpenBookings={() => setCurrentScreen('bookings')}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {currentScreen === 'tracking' && (
        <TrackingScreen
          booking={activeBooking}
          onBack={() => setCurrentScreen('home')}
          onOpenHome={() => setCurrentScreen('home')}
          onOpenFindWorkers={() => setCurrentScreen('findWorkers')}
          onOpenBookings={() => setCurrentScreen('bookings')}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onCompleteBooking={handleCompleteBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Bookings & History Screen */}
      {currentScreen === 'bookings' && (
        <CustomerBookingsScreen
          customer={customer}
          activeBooking={activeBooking}
          onBack={() => setCurrentScreen('home')}
          onOpenHome={() => setCurrentScreen('home')}
          onOpenFindWorkers={(tradeId, query) => {
            if (tradeId) setInitialTradeFilter(tradeId);
            else setInitialTradeFilter('all');
            if (query) setInitialSearchQuery(query);
            else setInitialSearchQuery('');
            setCurrentScreen('findWorkers');
          }}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {currentScreen === 'dashboard' && (
        <CustomerDashboardScreen
          customer={customer}
          onBack={() => setCurrentScreen('home')}
          onOpenHome={() => setCurrentScreen('home')}
          onOpenFindWorkers={() => setCurrentScreen('findWorkers')}
          onOpenBookings={() => setCurrentScreen('bookings')}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onLogout={async () => {
            try {
              await AsyncStorage.removeItem('@kaamdost_user');
              await AsyncStorage.removeItem('@kaamdost_auth_token');
              await AsyncStorage.removeItem('@kaamdost_active_booking');
            } catch (e) {}
            socketService.disconnect();
            setCustomer(null);
            setActiveBooking(null);
            setCurrentScreen('login');
          }}
          onDeleteAccount={async () => {
            try {
              if (customer?.phone) {
                await api.deleteAccount(customer.phone).catch(() => {});
              }
              await AsyncStorage.removeItem('@kaamdost_user');
              await AsyncStorage.removeItem('@kaamdost_auth_token');
              await AsyncStorage.removeItem('@kaamdost_active_booking');
              await AsyncStorage.removeItem('@kaamdost_language');
            } catch (e) {}
            socketService.disconnect();
            setCustomer(null);
            setActiveBooking(null);
            setCurrentScreen('language');
          }}
          onRestartOnboarding={async () => {
            try {
              await AsyncStorage.removeItem('@kaamdost_user');
              await AsyncStorage.removeItem('@kaamdost_auth_token');
              await AsyncStorage.removeItem('@kaamdost_active_booking');
            } catch (e) {}
            socketService.disconnect();
            setCustomer(null);
            setActiveBooking(null);
            setCurrentScreen('language');
          }}
          onSelectPastBooking={() => setCurrentScreen('support')}
        />
      )}

      {currentScreen === 'support' && (
        <CustomerSupportScreen onBack={() => setCurrentScreen('home')} />
      )}
      </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
