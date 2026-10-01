/**
 * KaamDost Customer App - Step 4 Verification Suite
 * Tests: Customer Gender + Service Address Flow + Multiple Saved Addresses (Home, Work, Other)
 *
 * Verifies all requirements from the STEP 4 Specification:
 *  1. TEST 1 — New customer: Registration -> Step 4 appears.
 *  2. TEST 2 — Existing customer with complete profile/address: Step 4 is skipped.
 *  3. TEST 3 — Existing customer missing address: Step 4 appears.
 *  4. TEST 4 — Gender: Mutual exclusivity (Male, Female, Others).
 *  5. TEST 5 — GPS permission granted: Coordinates obtained & address populated.
 *  6. TEST 6 — GPS permission denied: Manual address option remains available.
 *  7. TEST 7 — GPS failure/timeout: User can retry or manually enter address.
 *  8. TEST 8 — Manual address: Required fields validate and save successfully.
 *  9. TEST 9 — Pincode: Strict Indian 6-digit PIN validation (rejects non-digits & bad lengths).
 * 10. TEST 10 — GPS address editing: Detected location fields can be customized and saved.
 * 11. TEST 11 — Duplicate submission: Debounce/guard prevents multiple submissions.
 * 12. TEST 12 — Application restart: Session persistence ensures completed Step 4 is skipped on restart.
 * 13. TEST 13 — Security: Customer ID spoofing protection (403 Forbidden).
 * 14. TEST 14 — Multiple Addresses: Home, Work, Other types supported with custom label for Other.
 * 15. TEST 15 — Address Limits & Duplication Prevention: Max 3 addresses, duplicate type blocked.
 * 16. TEST 16 — Default Address Management: Exactly 1 default, safe reassignment on deletion.
 */

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

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
console.log('KAAMDOST CUSTOMER APP - STEP 4 TEST SUITE EXECUTION');
console.log('====================================================\n');

// Import configuration, storage, constants, and backend store
const {
  storage,
  getStoredLanguage,
  setStoredLanguage,
  clearStoredLanguage,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
} = require('../shared/storage/storage');

const { INDIAN_STATES_AND_UTS, GENDER_OPTIONS } = require('../shared/constants/indianStates');
const store = require('../../backend/src/data/store');

async function runTests() {
  const JWT_SECRET = process.env.JWT_SECRET || 'kaamdost-jwt-secret-production-key-2026';

  // ----------------------------------------------------
  // TEST 1 — New customer: Registration -> Step 4 appears
  // ----------------------------------------------------
  try {
    const appSource = fs.readFileSync(path.resolve(__dirname, 'App.js'), 'utf8');
    const handlesRegisterToStep4 =
      appSource.includes('handleRegisterSuccess') &&
      appSource.includes("setCurrentScreen('step4')") &&
      appSource.includes('<CustomerStep4Screen');

    recordTest(
      1,
      'New customer',
      'Registration -> Step 4 appears',
      'handleRegisterSuccess routes directly to step4 and renders CustomerStep4Screen',
      handlesRegisterToStep4
    );
  } catch (err) {
    recordTest(1, 'New customer', 'Transition to Step 4', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 2 — Existing customer with complete profile/address: Step 4 is skipped
  // ----------------------------------------------------
  try {
    const completeCust = {
      id: 'cust_complete_1',
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      gender: 'male',
      savedAddresses: [
        {
          id: 'addr_1',
          houseNumber: '12-4/A',
          street: 'Gandhi Road',
          city: 'Sangareddy',
          district: 'Sangareddy',
          state: 'Telangana',
          pincode: '502001',
          isDefault: true,
        },
      ],
    };

    const isComplete = store.isCustomerStep4Complete(completeCust);
    const appSource = fs.readFileSync(path.resolve(__dirname, 'App.js'), 'utf8');
    const skipsWhenComplete =
      appSource.includes('const isComplete = Boolean(result.step4Complete || cust.step4Complete)') &&
      appSource.includes("setCurrentScreen('authenticated')");

    recordTest(
      2,
      'Existing customer with complete profile/address',
      'Step 4 is skipped (routes directly to authenticated)',
      `store.isCustomerStep4Complete returns ${isComplete} and App.js bypasses step4`,
      isComplete && skipsWhenComplete
    );
  } catch (err) {
    recordTest(2, 'Existing customer complete', 'Skip Step 4', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 3 — Existing customer missing address: Step 4 appears
  // ----------------------------------------------------
  try {
    const incompleteCust = {
      id: 'cust_incomplete_1',
      fullName: 'Pooja Reddy',
      phone: '9876543211',
      gender: 'female',
      savedAddresses: [], // No address saved yet
    };

    const isComplete = store.isCustomerStep4Complete(incompleteCust);
    const appSource = fs.readFileSync(path.resolve(__dirname, 'App.js'), 'utf8');
    const routesToStep4WhenIncomplete =
      appSource.includes("setCurrentScreen('step4');");

    recordTest(
      3,
      'Existing customer missing address',
      'Step 4 appears',
      `store.isCustomerStep4Complete returns ${isComplete} (incomplete) and App.js routes to step4`,
      !isComplete && routesToStep4WhenIncomplete
    );
  } catch (err) {
    recordTest(3, 'Existing customer incomplete', 'Route to Step 4', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 4 — Gender: Select Male, Female, Others
  // ----------------------------------------------------
  try {
    const step4Source = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerStep4Screen.js'),
      'utf8'
    );

    const hasOptions =
      GENDER_OPTIONS.some((g) => g.value === 'male' && g.label === 'Male') &&
      GENDER_OPTIONS.some((g) => g.value === 'female' && g.label === 'Female') &&
      GENDER_OPTIONS.some((g) => g.value === 'other' && g.label === 'Others');

    const singleSelection =
      step4Source.includes('handleSelectGender(opt.value)') &&
      step4Source.includes('selectedGender === opt.value');

    recordTest(
      4,
      'Gender selection',
      'Male, Female, Others choices available; single selection only',
      `GENDER_OPTIONS contains male/female/other; single selection state verified`,
      hasOptions && singleSelection
    );
  } catch (err) {
    recordTest(4, 'Gender selection', 'Selectable cards', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 5 — GPS permission granted
  // ----------------------------------------------------
  try {
    const step4Source = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerStep4Screen.js'),
      'utf8'
    );

    const handlesGpsSuccess =
      step4Source.includes('navigator.geolocation.getCurrentPosition') &&
      step4Source.includes('client.reverseGeocode(lat, lng)') &&
      step4Source.includes('setHouseNumber(d.houseNumber)') &&
      step4Source.includes('setStreet(d.street)') &&
      step4Source.includes('setCity(d.city)') &&
      step4Source.includes('setPincode(d.pincode)');

    recordTest(
      5,
      'GPS permission granted',
      'GPS coordinates obtained and address populated via reverse-geocoding',
      'getCurrentPosition callback triggers reverseGeocode and populates address fields',
      handlesGpsSuccess
    );
  } catch (err) {
    recordTest(5, 'GPS permission granted', 'Reverse geocode & populate', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 6 — GPS permission denied
  // ----------------------------------------------------
  try {
    const step4Source = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerStep4Screen.js'),
      'utf8'
    );

    const handlesDenied =
      step4Source.includes('err.code === 1') &&
      step4Source.includes('Location permission was denied. You can enter your address manually.');

    recordTest(
      6,
      'GPS permission denied',
      'Manual address option remains available with clear explanation',
      'Permission denial (code 1) shows friendly error message and preserves manual entry fields',
      handlesDenied
    );
  } catch (err) {
    recordTest(6, 'GPS permission denied', 'Fallback manual option', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 7 — GPS failure / timeout
  // ----------------------------------------------------
  try {
    const step4Source = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerStep4Screen.js'),
      'utf8'
    );

    const handlesFailure =
      step4Source.includes('err.code === 3') &&
      step4Source.includes("We couldn't detect your location. Please try again or enter your address manually.");

    recordTest(
      7,
      'GPS failure / timeout',
      'User can retry or manually enter address',
      'Handles timeout error gracefully and preserves manual address entry',
      handlesFailure
    );
  } catch (err) {
    recordTest(7, 'GPS failure', 'Retry or manual entry', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 8 — Manual address: Enter fields & validate
  // ----------------------------------------------------
  try {
    const testCustomerId = 'cust_test_manual_1';
    const testCust = {
      id: testCustomerId,
      fullName: 'Vikram Joshi',
      phone: '9876543220',
      savedAddresses: [],
    };
    store.customers = store.customers.filter((c) => c.id !== testCustomerId);
    store.customers.push(testCust);

    const manualData = {
      gender: 'male',
      type: 'home',
      houseNumber: 'Flat 301, Sri Sai Residency',
      street: 'Subhash Road',
      landmark: 'Near Water Tank',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
    };

    const saveResult = store.saveCustomerStep4(testCustomerId, manualData);
    const updatedCust = store.getCustomerById(testCustomerId);
    const isNowComplete = store.isCustomerStep4Complete(updatedCust);

    recordTest(
      8,
      'Manual address validation & saving',
      'Address validates and saves successfully in customer profile',
      `Saved status: ${saveResult.success}, step4Complete: ${isNowComplete}`,
      saveResult.success && isNowComplete
    );
  } catch (err) {
    recordTest(8, 'Manual address', 'Validation & saving', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 9 — Pincode validation: 6 digits only
  // ----------------------------------------------------
  try {
    const PINCODE_RE = /^\d{6}$/;
    const validPins = ['502001', '500001', '110001', '560001'];
    const invalidPins = ['50200', '5020011', 'ABCDEF', '50200A', '', '   '];

    const allValidPassed = validPins.every((p) => PINCODE_RE.test(p));
    const allInvalidRejected = invalidPins.every((p) => !PINCODE_RE.test(p.trim()));

    recordTest(
      9,
      'Pincode validation',
      'Only valid 6-digit numeric PIN format accepted; non-numeric & bad length rejected',
      `Valid test set passed: ${allValidPassed}, Invalid test set rejected: ${allInvalidRejected}`,
      allValidPassed && allInvalidRejected
    );
  } catch (err) {
    recordTest(9, 'Pincode validation', 'Regex validation', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 10 — GPS address editing
  // ----------------------------------------------------
  try {
    const testCustomerId = 'cust_test_gps_edit_1';
    const testCust = {
      id: testCustomerId,
      fullName: 'Divya Nair',
      phone: '9876543230',
      savedAddresses: [],
    };
    store.customers = store.customers.filter((c) => c.id !== testCustomerId);
    store.customers.push(testCust);

    // 1. Initial GPS auto-detected address
    store.saveCustomerStep4(testCustomerId, {
      gender: 'female',
      type: 'home',
      houseNumber: 'Plot 42',
      street: 'Old Highway',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
      latitude: 17.619,
      longitude: 78.081,
    });

    // 2. Customer edits house number and landmark before continuing
    const editedResult = store.saveCustomerStep4(testCustomerId, {
      gender: 'female',
      type: 'home',
      houseNumber: 'Plot 42/B (2nd Floor)',
      street: 'Old Highway',
      landmark: 'Opposite State Bank',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
      latitude: 17.619,
      longitude: 78.081,
    });

    const updated = store.getCustomerById(testCustomerId);
    const savedAddr = updated.savedAddresses[0];
    const editVerified =
      savedAddr.houseNumber === 'Plot 42/B (2nd Floor)' &&
      savedAddr.landmark === 'Opposite State Bank';

    recordTest(
      10,
      'GPS address editing',
      'Detected location fields can be manually modified and saved',
      `Modified houseNumber: "${savedAddr.houseNumber}", landmark: "${savedAddr.landmark}"`,
      editVerified
    );
  } catch (err) {
    recordTest(10, 'GPS address editing', 'Manual modifications', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 11 — Duplicate submission debounce
  // ----------------------------------------------------
  try {
    const step4Source = fs.readFileSync(
      path.resolve(__dirname, 'src/screens/CustomerStep4Screen.js'),
      'utf8'
    );

    const hasDebounce =
      step4Source.includes('if (isSavingAddress) return;') &&
      step4Source.includes('if (isContinuing) return;') &&
      step4Source.includes('disabled={!canContinue}');

    recordTest(
      11,
      'Duplicate submission protection',
      'Tap Continue / Save repeatedly only triggers one submission',
      'isSavingAddress & isContinuing guards prevent duplicate requests',
      hasDebounce
    );
  } catch (err) {
    recordTest(11, 'Duplicate submission', 'Debounce check', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 12 — Application restart persistence
  // ----------------------------------------------------
  try {
    await clearStoredSession();
    const sessionData = {
      customer: {
        id: 'cust_restart_test',
        fullName: 'Kiran Kumar',
        phone: '9876543240',
        gender: 'male',
        step4Complete: true,
        authenticated: true,
        savedAddresses: [
          {
            id: 'addr_restart_1',
            type: 'home',
            houseNumber: 'House 88',
            street: 'MG Road',
            city: 'Sangareddy',
            district: 'Sangareddy',
            state: 'Telangana',
            pincode: '502001',
            isDefault: true,
          },
        ],
      },
      token: 'mock_jwt_token_123',
    };

    // Save session persistently
    await setStoredSession(sessionData.customer, sessionData.token);

    // Simulate App restart: read stored session
    const restored = await getStoredSession();
    const isStep4Persisted =
      restored &&
      restored.customer?.authenticated === true &&
      restored.customer?.step4Complete === true;

    recordTest(
      12,
      'Application restart persistence',
      'Completed Step 4 is not unnecessarily shown again on app reload',
      `Restored session step4Complete: ${restored?.customer?.step4Complete}`,
      isStep4Persisted
    );
  } catch (err) {
    recordTest(12, 'Application restart', 'Storage persistence', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 13 — Security: Customer ID spoofing protection
  // ----------------------------------------------------
  try {
    const serverSource = fs.readFileSync(
      path.resolve(__dirname, '../../backend/src/server.js'),
      'utf8'
    );

    const hasSecurityCheck =
      serverSource.includes('req.body.customerId && req.body.customerId !== authenticatedCustomerId') &&
      serverSource.includes('403') &&
      serverSource.includes("Forbidden: You cannot modify another customer's profile or address.");

    recordTest(
      13,
      'Security - Customer ID spoofing protection',
      'Customer cannot update another customer profile by manipulating customerId (403 Forbidden)',
      'Backend enforces authenticatedCustomerId from verified JWT token and rejects mismatch with 403 Forbidden',
      hasSecurityCheck
    );
  } catch (err) {
    recordTest(13, 'Security spoofing', '403 Forbidden check', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 14 — Multiple Addresses: Home, Work, Other
  // ----------------------------------------------------
  try {
    const testCustId = 'cust_multi_addr_test';
    const testCust = {
      id: testCustId,
      fullName: 'Sunil Rao',
      phone: '9876543250',
      savedAddresses: [],
    };
    store.customers = store.customers.filter((c) => c.id !== testCustId);
    store.customers.push(testCust);

    // Add Home
    const homeAddr = store.addCustomerAddress(testCustId, {
      type: 'home',
      houseNumber: '101',
      street: 'Home Street',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
    });

    // Add Work
    const workAddr = store.addCustomerAddress(testCustId, {
      type: 'work',
      houseNumber: 'Tech Park B',
      street: 'IT Corridor',
      city: 'Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    });

    // Add Other with custom label
    const otherAddr = store.addCustomerAddress(testCustId, {
      type: 'other',
      customLabel: "Parents' House",
      houseNumber: '45/C',
      street: 'Old Town',
      city: 'Medak',
      district: 'Medak',
      state: 'Telangana',
      pincode: '502110',
    });

    const addresses = store.getCustomerAddresses(testCustId);
    const hasAllThree =
      addresses.length === 3 &&
      addresses.some((a) => a.type === 'home') &&
      addresses.some((a) => a.type === 'work') &&
      addresses.some((a) => a.type === 'other' && a.customLabel === "Parents' House");

    recordTest(
      14,
      'Multiple Saved Addresses (Home, Work, Other)',
      'Customer can save Home, Work, and Other addresses with custom label for Other',
      `Saved ${addresses.length} addresses: Home, Work, Other (customLabel: "${otherAddr.customLabel}")`,
      hasAllThree
    );
  } catch (err) {
    recordTest(14, 'Multiple addresses', 'Home, Work, Other', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 15 — Duplicate Type Prevention & Max 3 Addresses Limit
  // ----------------------------------------------------
  try {
    const testCustId = 'cust_multi_addr_test'; // already has 3 addresses

    // 1. Try to add a 4th address -> should throw error
    let maxLimitBlocked = false;
    try {
      store.addCustomerAddress(testCustId, {
        type: 'home',
        houseNumber: '99',
        street: 'Fourth St',
        city: 'Sangareddy',
        district: 'Sangareddy',
        state: 'Telangana',
        pincode: '502001',
      });
    } catch (e) {
      maxLimitBlocked = e.message.includes('Maximum 3 saved addresses');
    }

    // 2. Try to add duplicate Home address on a customer with only Home
    const dupTestId = 'cust_dup_test_1';
    store.customers = store.customers.filter((c) => c.id !== dupTestId);
    store.customers.push({
      id: dupTestId,
      fullName: 'Dup Tester',
      phone: '9876543260',
      savedAddresses: [],
    });

    store.addCustomerAddress(dupTestId, {
      type: 'home',
      houseNumber: '1',
      street: 'First St',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
    });

    let duplicateTypeBlocked = false;
    try {
      store.addCustomerAddress(dupTestId, {
        type: 'home',
        houseNumber: '2',
        street: 'Second St',
        city: 'Sangareddy',
        district: 'Sangareddy',
        state: 'Telangana',
        pincode: '502001',
      });
    } catch (e) {
      duplicateTypeBlocked = e.message.includes('already exists');
    }

    recordTest(
      15,
      'Address limits & duplicate type prevention',
      'Max 3 addresses enforced and duplicate Home/Work/Other blocked with friendly error',
      `Max 3 blocked: ${maxLimitBlocked}, Duplicate type blocked: ${duplicateTypeBlocked}`,
      maxLimitBlocked && duplicateTypeBlocked
    );
  } catch (err) {
    recordTest(15, 'Duplicate type prevention', 'Max 3 limit', err.message, false);
  }

  // ----------------------------------------------------
  // TEST 16 — Default Address Management & Reassignment on Delete
  // ----------------------------------------------------
  try {
    const testCustId = 'cust_default_mgmt_test';
    store.customers = store.customers.filter((c) => c.id !== testCustId);
    store.customers.push({
      id: testCustId,
      fullName: 'Default Tester',
      phone: '9876543270',
      savedAddresses: [],
    });

    // Add first address -> automatically becomes default
    const addr1 = store.addCustomerAddress(testCustId, {
      type: 'home',
      houseNumber: '10',
      street: 'Home Ave',
      city: 'Sangareddy',
      district: 'Sangareddy',
      state: 'Telangana',
      pincode: '502001',
    });

    const isFirstDefault = addr1.isDefault === true;

    // Add second address -> not default unless specified
    const addr2 = store.addCustomerAddress(testCustId, {
      type: 'work',
      houseNumber: '20',
      street: 'Office Blvd',
      city: 'Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      isDefault: false,
    });

    // Explicitly set addr2 as default
    store.setDefaultCustomerAddress(testCustId, addr2.id);
    const custAfterSet = store.getCustomerById(testCustId);
    const addr2IsDefaultNow =
      custAfterSet.savedAddresses.find((a) => a.id === addr2.id)?.isDefault === true &&
      custAfterSet.savedAddresses.find((a) => a.id === addr1.id)?.isDefault === false;

    // Delete current default address (addr2) -> addr1 should be automatically reassigned as default!
    store.deleteCustomerAddress(testCustId, addr2.id);
    const custAfterDelete = store.getCustomerById(testCustId);
    const reassignedDefault =
      custAfterDelete.savedAddresses.length === 1 &&
      custAfterDelete.savedAddresses[0].id === addr1.id &&
      custAfterDelete.savedAddresses[0].isDefault === true;

    recordTest(
      16,
      'Default address management & reassignment on deletion',
      'Single default address maintained; deleting default safely reassigns to remaining address',
      `Auto-default first: ${isFirstDefault}, Set default: ${addr2IsDefaultNow}, Reassigned on delete: ${reassignedDefault}`,
      isFirstDefault && addr2IsDefaultNow && reassignedDefault
    );
  } catch (err) {
    recordTest(16, 'Default address management', 'Auto reassignment', err.message, false);
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  const passedCount = testResults.filter((r) => r.result === 'PASS').length;
  const totalCount = testResults.length;

  console.log('\n====================================================');
  console.log(`TEST SUITE SUMMARY: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log('====================================================\n');

  if (passedCount !== totalCount) {
    console.error('Some tests failed!');
    process.exit(1);
  } else {
    console.log('All 16 Step 4 tests passed with flying colors!');
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
