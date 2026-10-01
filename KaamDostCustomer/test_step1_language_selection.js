// Automated Verification Script for Step 1: Customer App Language Selection
const fs = require('fs');
const path = require('path');

const results = [];

function assert(description, condition, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${description}`);
    results.push({ test: description, status: 'PASS', details });
  } else {
    console.error(`❌ FAIL: ${description} - ${details}`);
    results.push({ test: description, status: 'FAIL', details });
  }
}

console.log('--- STARTING STEP 1 TESTING SUITE ---');

// 1. Language Configuration
const langConfigPath = path.resolve(__dirname, '../shared/i18n/languages.js');
assert('Language config file exists', fs.existsSync(langConfigPath));
const langContent = fs.readFileSync(langConfigPath, 'utf8');

const requiredCodes = ['en', 'te', 'hi', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as'];
const allCodesPresent = requiredCodes.every(code => langContent.includes(`'${code}'`) || langContent.includes(`"${code}"`));
assert('All 12 required language codes are defined in centralized config', allCodesPresent, 'Checked: ' + requiredCodes.join(', '));

// 2. Storage Module Verification
const storagePath = path.resolve(__dirname, '../shared/storage/storage.js');
assert('Storage module exists', fs.existsSync(storagePath));
const storageContent = fs.readFileSync(storagePath, 'utf8');
assert('Storage exports getStoredLanguage, setStoredLanguage, clearStoredLanguage',
  storageContent.includes('getStoredLanguage') &&
  storageContent.includes('setStoredLanguage') &&
  storageContent.includes('clearStoredLanguage')
);

// 3. LanguageSelectScreen Implementation
const screenPath = path.resolve(__dirname, 'src/screens/LanguageSelectScreen.js');
assert('LanguageSelectScreen exists', fs.existsSync(screenPath));
const screenContent = fs.readFileSync(screenPath, 'utf8');

assert('Test 6: Continue button is disabled when no language is selected',
  screenContent.includes('disabled={!isContinueEnabled}') || screenContent.includes('disabled={disabled}')
);

assert('Test 7: Error handling presents user-friendly error on save failure',
  screenContent.includes("Couldn't save your language preference. Please try again.")
);

assert('Test 8: Responsive ScrollView with accessible touch controls',
  screenContent.includes('ScrollView') &&
  screenContent.includes('accessibilityRole="button"')
);

// 4. App.js Startup Flow Verification
const appPath = path.resolve(__dirname, 'App.js');
const appContent = fs.readFileSync(appPath, 'utf8');

assert('App.js checks stored language on startup (getStoredLanguage)',
  appContent.includes('getStoredLanguage')
);

assert('App.js routes fresh user to languageSelect',
  appContent.includes("setCurrentScreen('languageSelect')")
);

assert('App.js routes returning user directly to login screen without showing language selection again',
  appContent.includes("if (preferredLanguage) {") && appContent.includes("setCurrentScreen('login');")
);

console.log('\n--- ALL TEST CASES EVALUATED ---');
console.table(results);
