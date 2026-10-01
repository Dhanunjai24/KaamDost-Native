// Centralized Language Configuration for KaamDost
export const SUPPORTED_LANGUAGES = [
  {
    languageCode: 'en',
    languageName: 'English',
    nativeName: 'English',
    enabled: true,
  },
  {
    languageCode: 'te',
    languageName: 'Telugu',
    nativeName: 'తెలుగు',
    enabled: true,
  },
  {
    languageCode: 'hi',
    languageName: 'Hindi',
    nativeName: 'हिन्दी',
    enabled: true,
  },
  {
    languageCode: 'ta',
    languageName: 'Tamil',
    nativeName: 'தமிழ்',
    enabled: true,
  },
  {
    languageCode: 'kn',
    languageName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    enabled: true,
  },
  {
    languageCode: 'ml',
    languageName: 'Malayalam',
    nativeName: 'മലയാളം',
    enabled: true,
  },
  {
    languageCode: 'mr',
    languageName: 'Marathi',
    nativeName: 'मराठी',
    enabled: true,
  },
  {
    languageCode: 'bn',
    languageName: 'Bengali',
    nativeName: 'বাংলা',
    enabled: true,
  },
  {
    languageCode: 'gu',
    languageName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    enabled: true,
  },
  {
    languageCode: 'pa',
    languageName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    enabled: true,
  },
  {
    languageCode: 'or',
    languageName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    enabled: true,
  },
  {
    languageCode: 'as',
    languageName: 'Assamese',
    nativeName: 'অসমীয়া',
    enabled: true,
  },
];

export const DEFAULT_LANGUAGE_CODE = 'en';

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.languageCode === code) || null;
};
