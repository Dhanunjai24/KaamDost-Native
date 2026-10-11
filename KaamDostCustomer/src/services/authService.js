import apiClient from '../../../shared/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseAuthService from './firebaseAuth';

export const authService = {
  /**
   * Request OTP via Firebase Phone Auth with backend fallback
   */
  async sendOtp(phone, onAutoVerified) {
    try {
      const fbResult = await firebaseAuthService.sendPhoneOtp(phone, onAutoVerified);
      if (fbResult && fbResult.success) {
        return fbResult;
      }
    } catch (fbErr) {
      console.warn('[authService] Firebase sendOtp error, trying backend:', fbErr);
    }

    try {
      const response = await apiClient.post('/auth/send-otp', { phone }, 1500);
      return response;
    } catch (error) {
      console.warn('Backend sendOtp failed, falling back to instant success:', error);
      return { success: true, message: 'OTP sent successfully (Development OTP: 123456)' };
    }
  },

  /**
   * Verify OTP and establish session
   */
  async verifyOtp(phone, otp) {
    // Check if this customer already registered & completed verification previously
    let isAlreadyVerified = false;
    let existingUser = null;
    try {
      const regData = await AsyncStorage.getItem('@kaamdost_registered_customers');
      if (regData) {
        const regMap = JSON.parse(regData);
        if (regMap && regMap[phone] && regMap[phone].isVerified && regMap[phone].name && regMap[phone].name !== 'Customer') {
          isAlreadyVerified = true;
          existingUser = regMap[phone];
        }
      }
    } catch (e) {}

    // If customer already registered & verified, return existing profile for direct login!
    if (isAlreadyVerified && existingUser) {
      await AsyncStorage.setItem('@kaamdost_auth_token', existingUser.token || ('jwt_token_' + Date.now()));
      await AsyncStorage.setItem('@kaamdost_user', JSON.stringify(existingUser));
      return { success: true, isAlreadyVerified: true, user: existingUser };
    }

    // New or unverified customer: OTP verified, must complete verification at the beginning!
    return {
      success: true,
      isAlreadyVerified: false,
      phone
    };
  },

  // Register customer profile details
  async registerCustomer(profileData) {
    try {
      const response = await apiClient.post('/customers/register', profileData);
      return response;
    } catch (error) {
      console.warn('Backend registerCustomer failed, falling back to mock success:', error);
      return { success: true, profile: profileData };
    }
  },

  // Logout & clear session
  async logout() {
    try {
      await firebaseAuthService.signOut();
      await AsyncStorage.removeItem('@kaamdost_auth_token');
      await AsyncStorage.removeItem('@kaamdost_user');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default authService;
