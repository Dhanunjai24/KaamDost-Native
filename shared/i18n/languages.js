// Centralized Language Configuration for KaamDost
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    languageCode: 'en',
    name: 'English',
    languageName: 'English',
    nativeName: 'English',
    enabled: true,
  },
  {
    code: 'te',
    languageCode: 'te',
    name: 'Telugu',
    languageName: 'Telugu',
    nativeName: 'తెలుగు',
    enabled: true,
  },
  {
    code: 'hi',
    languageCode: 'hi',
    name: 'Hindi',
    languageName: 'Hindi',
    nativeName: 'हिन्दी',
    enabled: true,
  },
  {
    code: 'ta',
    languageCode: 'ta',
    name: 'Tamil',
    languageName: 'Tamil',
    nativeName: 'தமிழ்',
    enabled: true,
  },
  {
    code: 'kn',
    languageCode: 'kn',
    name: 'Kannada',
    languageName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    enabled: true,
  },
  {
    code: 'ml',
    languageCode: 'ml',
    name: 'Malayalam',
    languageName: 'Malayalam',
    nativeName: 'മലയാളം',
    enabled: true,
  },
  {
    code: 'mr',
    languageCode: 'mr',
    name: 'Marathi',
    languageName: 'Marathi',
    nativeName: 'मराठी',
    enabled: true,
  },
  {
    code: 'bn',
    languageCode: 'bn',
    name: 'Bengali',
    languageName: 'Bengali',
    nativeName: 'বাংলা',
    enabled: true,
  },
  {
    code: 'gu',
    languageCode: 'gu',
    name: 'Gujarati',
    languageName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    enabled: true,
  },
  {
    code: 'pa',
    languageCode: 'pa',
    name: 'Punjabi',
    languageName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    enabled: true,
  },
  {
    code: 'or',
    languageCode: 'or',
    name: 'Odia',
    languageName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    enabled: true,
  },
  {
    code: 'as',
    languageCode: 'as',
    name: 'Assamese',
    languageName: 'Assamese',
    nativeName: 'অসমীয়া',
    enabled: true,
  },
];

export const DEFAULT_LANGUAGE_CODE = 'en';

export const getLanguageByCode = (code) => {
  return (
    SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === code || lang.languageCode === code
    ) || null
  );
};
