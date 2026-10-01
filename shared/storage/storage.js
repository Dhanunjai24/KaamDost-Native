// Centralized Storage & Preferences Management for KaamDost
const STORAGE_KEYS = {
  PREFERRED_LANGUAGE: 'kaamdost_preferred_language',
};

// In-memory fallback for environments without localStorage
let inMemoryStorage = {};

export const storage = {
  async getItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return inMemoryStorage[key] || null;
    } catch (error) {
      console.warn(`[Storage] Failed to read key "${key}":`, error);
      return inMemoryStorage[key] || null;
    }
  },

  async setItem(key, value) {
    try {
      inMemoryStorage[key] = value;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error(`[Storage] Failed to write key "${key}":`, error);
      throw error;
    }
  },

  async removeItem(key) {
    try {
      delete inMemoryStorage[key];
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.warn(`[Storage] Failed to remove key "${key}":`, error);
      return false;
    }
  },

  async clear() {
    try {
      inMemoryStorage = {};
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      return true;
    } catch (error) {
      console.warn('[Storage] Failed to clear storage:', error);
      return false;
    }
  },
};

// Language-specific persistence helpers
export async function getStoredLanguage() {
  try {
    return await storage.getItem(STORAGE_KEYS.PREFERRED_LANGUAGE);
  } catch (error) {
    console.warn('[Storage] Error reading stored language:', error);
    return null;
  }
}

export async function setStoredLanguage(languageCode) {
  if (!languageCode) {
    throw new Error('Language code is required');
  }
  return await storage.setItem(STORAGE_KEYS.PREFERRED_LANGUAGE, languageCode);
}

export async function clearStoredLanguage() {
  return await storage.removeItem(STORAGE_KEYS.PREFERRED_LANGUAGE);
}
