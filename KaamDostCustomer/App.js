import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import CustomerSupportScreen from './src/screens/CustomerSupportScreen';

export default function App({ onSwitchToPartner }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [customer, setCustomer] = useState({
    id: 'cust_101',
    name: 'Ravi Kumar',
    phone: '9876543210',
    maskedAadhaar: 'XXXX-XXXX-2345',
    address: {
      city: 'Sangareddy',
      street: 'Near Old Bus Stand Road',
      pincode: '502001'
    }
  });

  const [activeBooking, setActiveBooking] = useState({
    id: 'BK-8492',
    trade: 'masonry',
    tradeName: 'Mason',
    status: 'ARRIVING',
    workerName: 'Ramesh Reddy',
    workerPhone: '9848012345',
    workerRating: 4.9,
    startOtp: '4829',
    estimatedArrival: '12 mins',
    dailyRate: 950,
    totalAmount: 1045,
    address: 'Plot 42, Near Municipal Office, Sangareddy'
  });

  const handleBookingCreated = (newBooking) => {
    setActiveBooking(newBooking);
    setCurrentScreen('tracking');
  };

  const handleCompleteBooking = () => {
    setActiveBooking(null);
    setCurrentScreen('home');
  };

  const handleCancelBooking = () => {
    setActiveBooking(null);
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'language' && (
        <LanguageSelectScreen onContinue={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <PhoneLoginScreen
          onLoginSuccess={(user) => {
            setCustomer(prev => ({ ...prev, ...user }));
            setCurrentScreen('home');
          }}
          onSwitchRole={onSwitchToPartner}
        />
      )}

      {currentScreen === 'register' && (
        <CustomerRegisterScreen
          phone={customer.phone}
          onContinue={(data) => {
            setCustomer(prev => ({ ...prev, ...data }));
            setCurrentScreen('address');
          }}
        />
      )}

      {currentScreen === 'address' && (
        <CustomerAddressScreen
          onContinue={(data) => {
            setCustomer(prev => ({ ...prev, ...data }));
            setCurrentScreen('aadhaar');
          }}
        />
      )}

      {currentScreen === 'aadhaar' && (
        <CustomerAadhaarScreen
          onContinue={(data) => {
            setCustomer(prev => ({ ...prev, ...data }));
            setCurrentScreen('accountComplete');
          }}
        />
      )}

      {currentScreen === 'accountComplete' && (
        <AccountCompleteScreen
          customer={customer}
          onProceedHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'home' && (
        <CustomerHomeScreen
          customer={customer}
          activeBooking={activeBooking}
          onOpenFindWorkers={() => setCurrentScreen('findWorkers')}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenDashboard={() => setCurrentScreen('dashboard')}
          onOpenSupport={() => setCurrentScreen('support')}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {currentScreen === 'findWorkers' && (
        <FindWorkersScreen
          onBack={() => setCurrentScreen('home')}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {currentScreen === 'tracking' && (
        <TrackingScreen
          booking={activeBooking}
          onBack={() => setCurrentScreen('home')}
          onCompleteBooking={handleCompleteBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {currentScreen === 'dashboard' && (
        <CustomerDashboardScreen
          customer={customer}
          onBack={() => setCurrentScreen('home')}
          onLogout={() => setCurrentScreen('login')}
          onSelectPastBooking={() => setCurrentScreen('support')}
        />
      )}

      {currentScreen === 'support' && (
        <CustomerSupportScreen onBack={() => setCurrentScreen('home')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
