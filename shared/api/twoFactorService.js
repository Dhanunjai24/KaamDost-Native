// ====================================================================
// KAAMDOST NATIVE — 2FACTOR.IN CLIENT SERVICE
// ====================================================================
// Dedicated Indian SMS Gateway Service for KaamDostCustomer & KaamDostPartner.
// Dispatches transactional OTPs to Indian mobile numbers via 2Factor.in API.

let ENV_TWOFACTOR_API_KEY = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const env = require('react-native-dotenv');
  if (env && env.TWOFACTOR_API_KEY) {
    ENV_TWOFACTOR_API_KEY = env.TWOFACTOR_API_KEY;
  }
} catch (e) {
  // Fallback for environment contexts
}

const DEFAULT_API_KEY = 'ff9366dd-a396-11f1-9cb1-0200cd936042';

export class TwoFactorService {
  constructor(apiKey = null) {
    this.apiKey = apiKey || ENV_TWOFACTOR_API_KEY || DEFAULT_API_KEY;
  }

  setApiKey(key) {
    if (key && key.trim()) {
      this.apiKey = key.trim();
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  /**
   * Dispatch OTP SMS via 2Factor.in AUTOGEN transactional route
   * @param {string} phone 10-digit Indian phone number
   * @returns {Promise<{success: boolean, sessionId?: string, message?: string, error?: string, fallbackOtp?: string}>}
   */
  async sendOtp(phone) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const url = `https://2factor.in/API/V1/${encodeURIComponent(this.apiKey)}/SMS/+91${cleanPhone}/AUTOGEN`;

    try {
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json().catch(() => ({}));

      if (data && data.Status === 'Success') {
        return {
          success: true,
          mode: '2factor',
          sessionId: data.Details,
          phone: cleanPhone,
          message: `OTP dispatched to +91 ${cleanPhone} via 2Factor.in.`
        };
      }

      console.warn('⚠️ [2Factor.in Dispatch Error]:', data?.Details || data?.Status);
      return {
        success: false,
        mode: 'simulator',
        error: data?.Details || 'Failed to dispatch SMS via 2Factor.',
        fallbackOtp: '123456'
      };
    } catch (err) {
      console.warn('⚠️ [2Factor.in Network Error]:', err.message);
      return {
        success: false,
        mode: 'simulator',
        error: err.message,
        fallbackOtp: '123456'
      };
    }
  }

  /**
   * Verify entered OTP against 2Factor.in session
   * @param {string} sessionId Session ID received from sendOtp
   * @param {string} otp 6-digit entered OTP code
   * @returns {Promise<{success: boolean, verified: boolean, error?: string}>}
   */
  async verifyOtp(sessionId, otp) {
    if (!sessionId || !otp) {
      return { success: false, error: 'Session ID and OTP code are required.' };
    }

    // Bypass code for testing/development
    if (otp === '123456') {
      return { success: true, verified: true };
    }

    const url = `https://2factor.in/API/V1/${encodeURIComponent(this.apiKey)}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(otp)}`;

    try {
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json().catch(() => ({}));

      if (data && data.Status === 'Success') {
        return { success: true, verified: true };
      }

      return {
        success: false,
        verified: false,
        error: data?.Details || 'Invalid OTP. Please check the code.'
      };
    } catch (err) {
      return { success: false, verified: false, error: err.message };
    }
  }
}

export const twoFactorClient = new TwoFactorService();
export default twoFactorClient;
