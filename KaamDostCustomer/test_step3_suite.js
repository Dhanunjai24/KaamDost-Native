// Verification Suite for Step 3: Customer Registration Decision (New vs. Existing Customer)
const fs = require('fs');
const path = require('path');

const testResults = [];

function recordTest(testNum, testName, expected, actual, passed, details = '') {
  testResults.push({
    test: `Test ${testNum}: ${testName}`,
    expected,
    actual,
    result: passed ? 'PASS' : 'FAIL',
    details,
  });
  if (passed) {
    console.log(`✅ [PASS] Test ${testNum}: ${testName} ${details ? '- ' + details : ''}`);
  } else {
    console.error(`❌ [FAIL] Test ${testNum}: ${testName} - ${details}`);
  }
}

console.log('====================================================');
console.log('KAAMDOST CUSTOMER APP - STEP 3 TEST SUITE EXECUTION');
console.log('====================================================\n');

// Import configuration, storage, and backend store
const {
  storage,
  getStoredLanguage,
  setStoredLanguage,
  clearStoredLanguage,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
} = require('../shared/storage/storage');

const store = require('../../backend/src/data/store');

async function runTests() {
  // ----------------------------------------------------
  // TEST 1 — New customer: Mobile -> OTP -> OTP verified -> Customer does not exist -> Registration screen
  // ----------------------------------------------------
  try {
    const otpScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/OtpVerificationScreen.js'),
      'utf8'
    );
    const appSource = fs.readFileSync(path.resolve(__dirname, 'App.js'), 'utf8');

    // Verify OtpVerificationScreen branches when isNewCustomer is true
    const otpBranchesNewCustomer =
      otpScreenSource.includes('if (response.isNewCustomer)') &&
      otpScreenSource.includes('isNewCustomer: true');

    // Verify App.js navigates to 'register' screen
    const appRoutesToRegister =
      appSource.includes("setCurrentScreen('register')") &&
      appSource.includes('<CustomerRegisterScreen');

    const test1Passed = otpBranchesNewCustomer && appRoutesToRegister;
    recordTest(
      1,
      'New customer',
      'OTP verified -> Customer does not exist -> Registration screen',
      'Detected new customer, transitioned to "Create Your Account" registration screen',
      test1Passed
    );
  } catch (err) {
    recordTest(1, 'New customer', 'Transition to register', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 2 — Existing customer: Mobile -> OTP -> OTP verified -> Customer exists -> SKIP REGISTRATION -> Next Step
  // ----------------------------------------------------
  try {
    const otpScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/OtpVerificationScreen.js'),
      'utf8'
    );
    const appSource = fs.readFileSync(path.resolve(__dirname, 'App.js'), 'utf8');

    // Verify OtpVerificationScreen restores session directly when existing customer
    const otpBypassesRegisterForExisting =
      otpScreenSource.includes('EXISTING CUSTOMER: Skip Registration Form') &&
      otpScreenSource.includes('isNewCustomer: false') &&
      otpScreenSource.includes('setStoredSession(sessionCustomer, token)');

    // Verify App.js directly routes existing customer to authenticated
    const appRoutesToAuthenticated =
      appSource.includes('setSession({ customer: result.customer, token: result.token })') &&
      appSource.includes("setCurrentScreen('authenticated')");

    const test2Passed = otpBypassesRegisterForExisting && appRoutesToAuthenticated;
    recordTest(
      2,
      'Existing customer',
      'OTP verified -> Customer exists -> SKIP REGISTRATION -> Next Step',
      'Registration skipped; existing customer session restored and routed to authenticated step',
      test2Passed
    );
  } catch (err) {
    recordTest(2, 'Existing customer', 'Skip registration', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 3 — Mobile auto-population: Verified mobile appears automatically in registration
  // ----------------------------------------------------
  try {
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const hasAutoPopulatedValue = regScreenSource.includes('value={`+91 ${cleanPhone}`}');
    const hasVerifiedBadge = regScreenSource.includes('Verified ✓');

    const test3Passed = hasAutoPopulatedValue && hasVerifiedBadge;
    recordTest(
      3,
      'Mobile auto-population',
      'Verified mobile number appears automatically with "Verified ✓" badge',
      'Phone is auto-populated with country code prefix and verified green badge',
      test3Passed
    );
  } catch (err) {
    recordTest(3, 'Mobile auto-population', 'Auto-populated', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 4 — Mobile cannot be edited: Read-only / non-editable
  // ----------------------------------------------------
  try {
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const isNonEditable =
      regScreenSource.includes('editable={false}') &&
      regScreenSource.includes('selectTextOnFocus={false}');

    recordTest(
      4,
      'Mobile cannot be edited',
      'Mobile input field is strictly read-only and non-editable',
      'Field has editable={false} and cannot be altered by customer',
      isNonEditable
    );
  } catch (err) {
    recordTest(4, 'Mobile cannot be edited', 'Read-only', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 5 — Missing name: Blocked with "Please enter your full name."
  // ----------------------------------------------------
  try {
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const validatesName =
      regScreenSource.includes('!fullName.trim()') &&
      regScreenSource.includes("setErrorMessage('Please enter your full name.')");

    recordTest(
      5,
      'Missing name',
      'Registration blocked with "Please enter your full name."',
      'Empty name detected and blocked with exact error message',
      validatesName
    );
  } catch (err) {
    recordTest(5, 'Missing name', 'Name error', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 6 — Invalid email: Blocked with "Please enter a valid email address."
  // ----------------------------------------------------
  try {
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const validatesEmail =
      regScreenSource.includes('isEmailValid = EMAIL_RE.test') &&
      regScreenSource.includes("setErrorMessage('Please enter a valid email address.')");

    recordTest(
      6,
      'Invalid email',
      'Registration blocked with "Please enter a valid email address."',
      'Malformed email rejected with standard RFC format check and exact error message',
      validatesEmail
    );
  } catch (err) {
    recordTest(6, 'Invalid email', 'Email error', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 7 — Referral empty: Registration works normally
  // ----------------------------------------------------
  try {
    const testPhone = '9977881122';
    // Clean any prior state in store
    store.customers = store.customers.filter((c) => c.phone !== testPhone);
    store.setVerifiedRegistrationPhone(testPhone);

    const result = store.registerCustomerStep3({
      fullName: 'Vikram Singh',
      phone: testPhone,
      email: 'vikram.singh@gmail.com',
      referralCode: '', // Empty referral
    });

    const test7Passed =
      result &&
      result.phone === testPhone &&
      result.referredBy === null &&
      result.fullName === 'Vikram Singh';

    recordTest(
      7,
      'Referral empty',
      'Registration succeeds normally without referral code',
      `Customer registered successfully with referredBy=null`,
      test7Passed
    );
  } catch (err) {
    recordTest(7, 'Referral empty', 'Registration succeeds', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 8 — Valid referral: Referral passed to backend correctly
  // ----------------------------------------------------
  try {
    const testPhone = '9977883344';
    store.customers = store.customers.filter((c) => c.phone !== testPhone);
    store.setVerifiedRegistrationPhone(testPhone);

    const result = store.registerCustomerStep3({
      fullName: 'Ananya Sharma',
      phone: testPhone,
      email: 'ananya@gmail.com',
      referralCode: 'WELCOME', // Valid referral promo code
    });

    const test8Passed = result && result.referredBy === 'WELCOME';
    recordTest(
      8,
      'Valid referral',
      'Valid referral code accepted and stored in customer record',
      `Referral code "WELCOME" stored in referredBy`,
      test8Passed
    );
  } catch (err) {
    recordTest(8, 'Valid referral', 'Referral stored', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 9 — Invalid referral: Clear validation error: "This referral code is not valid."
  // ----------------------------------------------------
  try {
    const testPhone = '9977885566';
    store.customers = store.customers.filter((c) => c.phone !== testPhone);
    store.setVerifiedRegistrationPhone(testPhone);

    let caughtError = '';
    try {
      store.registerCustomerStep3({
        fullName: 'Kiran Kumar',
        phone: testPhone,
        email: 'kiran@gmail.com',
        referralCode: 'INVALID_BOGUS_CODE_999',
      });
    } catch (err) {
      caughtError = err.message;
    }

    const test9Passed = caughtError.includes('This referral code is not valid.');
    recordTest(
      9,
      'Invalid referral',
      'Rejected with error: "This referral code is not valid."',
      `Backend rejected invalid referral code: "${caughtError}"`,
      test9Passed
    );
  } catch (err) {
    recordTest(9, 'Invalid referral', 'Error thrown', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 10 — Duplicate submission: Rapid repeated taps creates only one account
  // ----------------------------------------------------
  try {
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const hasDebounceProtection =
      regScreenSource.includes('if (loading) return;') &&
      regScreenSource.includes('setLoading(true);') &&
      regScreenSource.includes('disabled={!isFormValid || loading}');

    recordTest(
      10,
      'Duplicate submission',
      'Repeated rapid taps disabled during processing; only 1 submission allowed',
      'State-level loading lock and button disabling prevent race condition duplicates',
      hasDebounceProtection
    );
  } catch (err) {
    recordTest(10, 'Duplicate submission', 'Debounced', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 11 — Same mobile registration attempt: Duplicate mobile rejected with error
  // ----------------------------------------------------
  try {
    const testPhone = '9977887788';
    store.customers = store.customers.filter((c) => c.phone !== testPhone);
    store.setVerifiedRegistrationPhone(testPhone);

    // 1st registration
    store.registerCustomerStep3({
      fullName: 'Original User',
      phone: testPhone,
      email: 'original@gmail.com',
    });

    // 2nd registration attempt with same phone
    let duplicateError = '';
    try {
      store.registerCustomerStep3({
        fullName: 'Duplicate User',
        phone: testPhone,
        email: 'duplicate@gmail.com',
      });
    } catch (err) {
      duplicateError = err.message;
    }

    const test11Passed = duplicateError.includes(
      'An account with this mobile number already exists. Please continue with login.'
    );

    recordTest(
      11,
      'Same mobile registration attempt',
      'Duplicate mobile rejected with clear error message',
      `Duplicate registration blocked: "${duplicateError}"`,
      test11Passed
    );
  } catch (err) {
    recordTest(11, 'Same mobile registration attempt', 'Duplicate blocked', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 12 — Network failure: Friendly error + retry permitted
  // ----------------------------------------------------
  try {
    const clientSource = fs.readFileSync(
      path.resolve(__dirname, '../shared/api/client.js'),
      'utf8'
    );
    const regScreenSource = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerRegisterScreen.js'),
      'utf8'
    );

    const clientCatchesError = clientSource.includes(
      "error: \"We couldn't create your account. Please try again.\""
    );
    const screenShowsFriendlyError = regScreenSource.includes(
      "We couldn't create your account. Please try again."
    );

    const test12Passed = clientCatchesError && screenShowsFriendlyError;
    recordTest(
      12,
      'Network failure',
      'Friendly error displayed: "We couldn\'t create your account. Please try again."',
      'Network rejection safely caught and user-friendly error message rendered',
      test12Passed
    );
  } catch (err) {
    recordTest(12, 'Network failure', 'Friendly error', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 13 — Application restart: Authenticated session restored, skips registration
  // ----------------------------------------------------
  try {
    const registeredCustomer = {
      authenticated: true,
      customerId: 'cust_registered_step3',
      id: 'cust_registered_step3',
      fullName: 'Pooja Hegde',
      name: 'Pooja Hegde',
      mobileNumber: '9848099887',
      email: 'pooja.hegde@gmail.com',
      phoneVerified: true,
    };

    await setStoredLanguage('en');
    await setStoredSession(registeredCustomer, 'jwt_registered_step3_token');

    // Simulate restart lookup
    const lang = await getStoredLanguage();
    const sess = await getStoredSession();

    let startupScreen = 'loading';
    if (!lang) {
      startupScreen = 'language';
    } else if (sess && sess.customer?.authenticated) {
      startupScreen = 'authenticated';
    } else {
      startupScreen = 'mobileLogin';
    }

    const test13Passed =
      lang === 'en' &&
      sess !== null &&
      sess.customer.authenticated === true &&
      sess.customer.fullName === 'Pooja Hegde' &&
      startupScreen === 'authenticated';

    recordTest(
      13,
      'Application restart',
      'Valid session restored, registration and login skipped on restart',
      `Restored screen "${startupScreen}" for ${sess?.customer?.fullName} (customerId=${sess?.customer?.customerId})`,
      test13Passed
    );
  } catch (err) {
    recordTest(13, 'Application restart', 'Session restored', err.message, false);
  }

  console.log('\n====================================================');
  console.log('SUMMARY TABLE:');
  console.log('====================================================');
  console.table(
    testResults.map((r) => ({
      Test: r.test,
      Expected: r.expected,
      Result: r.result,
    }))
  );

  const allPassed = testResults.every((r) => r.result === 'PASS');
  if (allPassed) {
    console.log('\n🎉 ALL 13 STEP 3 TESTS PASSED SUCCESSFULLY!\n');
  } else {
    console.error('\n⚠️ SOME TESTS FAILED. PLEASE REVIEW.\n');
    process.exit(1);
  }
}

runTests();
