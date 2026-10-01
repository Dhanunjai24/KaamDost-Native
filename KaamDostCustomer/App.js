import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Onboarding & Auth screens (Screens 01 - 08)
import SplashScreen from './src/screens/SplashScreen';
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import CustomerRegisterScreen from './src/screens/CustomerRegisterScreen';
import CustomerGenderScreen from './src/screens/CustomerGenderScreen';
import CustomerAddressScreen from './src/screens/CustomerAddressScreen';
import CustomerAadhaarScreen from './src/screens/CustomerAadhaarScreen';
import LiveSelfieScreen from './src/screens/LiveSelfieScreen';
import AccountCompleteScreen from './src/screens/AccountCompleteScreen';

// Discovery & Booking Flow (Screens 09 - 16)
import CustomerHomeScreen from './src/screens/CustomerHomeScreen';
import ServiceCategoriesScreen from './src/screens/ServiceCategoriesScreen';
import ServiceSearchScreen from './src/screens/ServiceSearchScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import AdditionalDetailsScreen from './src/screens/AdditionalDetailsScreen';
import SelectAddressScreen from './src/screens/SelectAddressScreen';
import PriceDetailsScreen from './src/screens/PriceDetailsScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';

// Tracking, Chat, Payment & Account Flow (Screens 17 - 27)
import FindingWorkerScreen from './src/screens/FindingWorkerScreen';
import BookingTimelineScreen from './src/screens/BookingTimelineScreen';
import InAppChatScreen from './src/screens/InAppChatScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import CustomerNotificationsScreen from './src/screens/CustomerNotificationsScreen';
import CustomerPaymentScreen from './src/screens/CustomerPaymentScreen';
import CustomerWalletScreen from './src/screens/CustomerWalletScreen';
import ReviewsRatingScreen from './src/screens/ReviewsRatingScreen';
import ReferralRewardsScreen from './src/screens/ReferralRewardsScreen';
import CustomerProfileScreen from './src/screens/CustomerProfileScreen';
import CustomerHelpSupportScreen from './src/screens/CustomerHelpSupportScreen';

export default function App({ onSwitchToPartner }) {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const [selectedService, setSelectedService] = useState({
    id: 'cleaning',
    title: 'Home Cleaning',
    price: '₹999',
    rating: '4.8 (2.3k)',
    duration: '2-3 hrs',
    clients: '3.2k Clients',
    description: 'Professional service for a cleaner home',
    included: [
      'Living room cleaning',
      'Kitchen cleaning',
      'Bathroom cleaning',
      'Floor cleaning',
    ],
  });

  const [customer, setCustomer] = useState({
    id: 'cust_101',
    name: 'Rahul Sharma',
    phone: '9876543210',
    gender: 'Male',
    maskedAadhaar: 'XXXX-XXXX-3847',
    address: {
      label: 'Home',
      street: '123 Green Park',
      city: 'New Delhi',
      pincode: '110016',
    },
  });

  const [activeBooking, setActiveBooking] = useState({
    id: 'KD123456',
    trade: 'cleaning',
    tradeName: 'Home Cleaning - Deep Cleaning',
    status: 'ARRIVING',
    workerName: 'Rohit Kumar',
    workerPhone: '9848012345',
    workerRating: 4.8,
    startOtp: '4829',
    estimatedArrival: '10 mins',
    dailyRate: 999,
    totalAmount: 1237,
    address: '123 Green Park, New Delhi',
    scheduledDate: '26 Apr 2025 • 10:00 AM',
  });

  const handleTabNavigation = (tabId) => {
    const tab = tabId ? tabId.toLowerCase() : '';
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'services') setCurrentScreen('categories');
    else if (tab === 'bookings') setCurrentScreen('bookingTimeline');
    else if (tab === 'wallet') setCurrentScreen('wallet');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  const handleBookingCreated = (newBooking) => {
    setActiveBooking(newBooking);
    setCurrentScreen('bookingConfirmation');
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
      {/* Screen 01: Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('login')} />
      )}

      {/* Screen 02: Phone Login */}
      {currentScreen === 'login' && (
        <PhoneLoginScreen
          onLoginSuccess={(user) => {
            if (user) setCustomer((prev) => ({ ...prev, ...user }));
            setCurrentScreen('home');
          }}
          onGoToRegister={() => setCurrentScreen('register')}
          onSwitchRole={onSwitchToPartner}
        />
      )}

      {/* Screen 03: Register Name & Phone */}
      {currentScreen === 'register' && (
        <CustomerRegisterScreen
          initialPhone={customer.phone}
          onContinue={(data) => {
            setCustomer((prev) => ({ ...prev, ...data }));
            setCurrentScreen('gender');
          }}
          onBackToLogin={() => setCurrentScreen('login')}
        />
      )}

      {/* Screen 04: Select Gender */}
      {currentScreen === 'gender' && (
        <CustomerGenderScreen
          onContinue={(data) => {
            setCustomer((prev) => ({ ...prev, ...data }));
            setCurrentScreen('address');
          }}
          onBack={() => setCurrentScreen('register')}
        />
      )}

      {/* Screen 05: Select / Add Address */}
      {currentScreen === 'address' && (
        <CustomerAddressScreen
          onContinue={(data) => {
            setCustomer((prev) => ({ ...prev, ...data }));
            setCurrentScreen('aadhaar');
          }}
          onBack={() => setCurrentScreen('gender')}
        />
      )}

      {/* Screen 06: Aadhaar Verification */}
      {currentScreen === 'aadhaar' && (
        <CustomerAadhaarScreen
          onContinue={(data) => {
            setCustomer((prev) => ({ ...prev, ...data }));
            setCurrentScreen('selfie');
          }}
          onBack={() => setCurrentScreen('address')}
        />
      )}

      {/* Screen 07: Live Selfie Camera */}
      {currentScreen === 'selfie' && (
        <LiveSelfieScreen
          onContinue={(data) => {
            setCustomer((prev) => ({ ...prev, ...data }));
            setCurrentScreen('accountComplete');
          }}
          onBack={() => setCurrentScreen('aadhaar')}
        />
      )}

      {/* Screen 08: Account Complete Checkmarks */}
      {currentScreen === 'accountComplete' && (
        <AccountCompleteScreen
          customer={customer}
          onProceedHome={() => setCurrentScreen('home')}
        />
      )}

      {/* Screen 09: Customer Home */}
      {currentScreen === 'home' && (
        <CustomerHomeScreen
          customer={customer}
          activeBooking={activeBooking}
          onOpenCategories={() => setCurrentScreen('categories')}
          onOpenSearch={() => setCurrentScreen('search')}
          onSelectService={(srv) => {
            setSelectedService(srv);
            setCurrentScreen('serviceDetail');
          }}
          onOpenTracking={() => setCurrentScreen('tracking')}
          onOpenBookings={() => setCurrentScreen('bookingTimeline')}
          onOpenWallet={() => setCurrentScreen('wallet')}
          onOpenProfile={() => setCurrentScreen('profile')}
          onOpenNotifications={() => setCurrentScreen('notifications')}
        />
      )}

      {/* Screen 10: All Categories */}
      {currentScreen === 'categories' && (
        <ServiceCategoriesScreen
          onBack={() => setCurrentScreen('home')}
          onSelectService={(srv) => {
            setSelectedService(srv);
            setCurrentScreen('serviceDetail');
          }}
        />
      )}

      {/* Screen 11: Service Search */}
      {currentScreen === 'search' && (
        <ServiceSearchScreen
          onBack={() => setCurrentScreen('home')}
          onSelectService={(srv) => {
            setSelectedService(srv);
            setCurrentScreen('serviceDetail');
          }}
        />
      )}

      {/* Screen 12: Service Details */}
      {currentScreen === 'serviceDetail' && (
        <ServiceDetailScreen
          service={selectedService}
          onBack={() => setCurrentScreen('home')}
          onContinue={(srv) => {
            setSelectedService(srv);
            setCurrentScreen('additionalDetails');
          }}
        />
      )}

      {/* Screen 13: Additional Details & Customizations */}
      {currentScreen === 'additionalDetails' && (
        <AdditionalDetailsScreen
          service={selectedService}
          customerAddress={customer.address}
          onBack={() => setCurrentScreen('serviceDetail')}
          onOpenAddressPicker={() => setCurrentScreen('selectAddress')}
          onContinue={(details) => {
            setCurrentScreen('priceDetails');
          }}
        />
      )}

      {/* Screen 14: Select Saved Address */}
      {currentScreen === 'selectAddress' && (
        <SelectAddressScreen
          currentSelected={customer.address?.label || 'Home'}
          onBack={() => setCurrentScreen('additionalDetails')}
          onSelectAddress={(addr) => {
            setCustomer((prev) => ({ ...prev, address: addr }));
            setCurrentScreen('additionalDetails');
          }}
        />
      )}

      {/* Screen 15: Price Breakdown & GST */}
      {currentScreen === 'priceDetails' && (
        <PriceDetailsScreen
          service={selectedService}
          onBack={() => setCurrentScreen('additionalDetails')}
          onProceedToBook={(bill) => {
            const newBooking = {
              id: 'KD123456',
              trade: selectedService?.id || 'cleaning',
              tradeName: `${selectedService?.title || 'Home Cleaning'} - Deep Cleaning`,
              scheduledDate: '26 Apr 2025 • 10:00 AM',
              address: customer?.address?.street || '123 Green Park, New Delhi',
              totalAmount: bill.totalAmount || 1237,
              workerName: 'Rohit Kumar',
              workerPhone: '9848012345',
              workerRating: 4.8,
              startOtp: '4829',
              estimatedArrival: '10 mins',
              status: 'ARRIVING',
            };
            handleBookingCreated(newBooking);
          }}
        />
      )}

      {/* Screen 16: Booking Confirmation */}
      {currentScreen === 'bookingConfirmation' && (
        <BookingConfirmationScreen
          booking={activeBooking}
          onViewBookingDetails={() => setCurrentScreen('findingWorker')}
          onGoToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* Screen 17: Radar Finding Worker */}
      {currentScreen === 'findingWorker' && (
        <FindingWorkerScreen
          onBack={() => setCurrentScreen('home')}
          onWorkerFound={() => setCurrentScreen('bookingTimeline')}
        />
      )}

      {/* Screen 18: Booking Status Timeline */}
      {currentScreen === 'bookingTimeline' && (
        <BookingTimelineScreen
          booking={activeBooking}
          onBack={() => setCurrentScreen('home')}
          onProceedWorker={() => setCurrentScreen('tracking')}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Screen 19: In-App Chat with Worker */}
      {currentScreen === 'inAppChat' && (
        <InAppChatScreen
          workerName={activeBooking?.workerName || 'Rohit Kumar'}
          onBack={() => setCurrentScreen('tracking')}
        />
      )}

      {/* Screen 20: Live GPS Route Tracking */}
      {currentScreen === 'tracking' && (
        <TrackingScreen
          booking={activeBooking}
          onBack={() => setCurrentScreen('home')}
          onOpenChat={() => setCurrentScreen('inAppChat')}
          onOpenPayment={() => setCurrentScreen('payment')}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Screen 21: Notifications */}
      {currentScreen === 'notifications' && (
        <CustomerNotificationsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {/* Screen 22: Payment Gateway (UPI / QR) */}
      {currentScreen === 'payment' && (
        <CustomerPaymentScreen
          totalAmount={activeBooking?.totalAmount || 1237}
          onBack={() => setCurrentScreen('tracking')}
          onPaymentSuccess={() => setCurrentScreen('reviewsRating')}
        />
      )}

      {/* Screen 23: KaamDost Wallet */}
      {currentScreen === 'wallet' && (
        <CustomerWalletScreen onBack={() => setCurrentScreen('home')} />
      )}

      {/* Screen 24: Ratings & Reviews */}
      {currentScreen === 'reviewsRating' && (
        <ReviewsRatingScreen
          workerName={activeBooking?.workerName || 'Rohit Kumar'}
          onClose={handleCompleteBooking}
          onSubmitReview={handleCompleteBooking}
        />
      )}

      {/* Screen 25: Referral Rewards */}
      {currentScreen === 'referrals' && (
        <ReferralRewardsScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {/* Screen 26: Customer Profile */}
      {currentScreen === 'profile' && (
        <CustomerProfileScreen
          customer={customer}
          onBack={() => setCurrentScreen('home')}
          onOpenBookings={() => setCurrentScreen('bookingTimeline')}
          onOpenAddresses={() => setCurrentScreen('selectAddress')}
          onOpenWallet={() => setCurrentScreen('wallet')}
          onOpenNotifications={() => setCurrentScreen('notifications')}
          onOpenReferrals={() => setCurrentScreen('referrals')}
          onOpenSupport={() => setCurrentScreen('helpSupport')}
          onLogout={() => setCurrentScreen('login')}
          onTabPress={handleTabNavigation}
        />
      )}

      {/* Screen 27: Help & Support */}
      {currentScreen === 'helpSupport' && (
        <CustomerHelpSupportScreen
          onBack={() => setCurrentScreen('profile')}
          onOpenLiveChat={() => setCurrentScreen('inAppChat')}
          onTabPress={handleTabNavigation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
});
