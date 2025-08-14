// GDPR compliance utility for geolocation-based consent management

// EU/EEA countries where GDPR applies (ISO 3166-1 alpha-2 codes)
const GDPR_COUNTRIES = [
  'AD', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
  'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'GB'
];

// Countries with stricter privacy laws (requiring explicit consent)
const STRICT_PRIVACY_COUNTRIES = [
  ...GDPR_COUNTRIES,
  'CA', // Canada (PIPEDA)
  'AU', // Australia (Privacy Act)
  'NZ'  // New Zealand (Privacy Act)
];

/**
 * Detects user's country using multiple fallback methods
 * @returns {Promise<string>} ISO 3166-1 alpha-2 country code
 */
export async function detectUserCountry() {
  // Debug: Allow manual country override
  const debugCountry = localStorage.getItem('debug-country');
  if (debugCountry) {
    console.log('🚨 DEBUG: Using manual country override:', debugCountry);
    return debugCountry.toUpperCase();
  }

  try {
    // Method 1: Try geolocation API with timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryFromTimezone = getCountryFromTimezone(timezone);
    if (countryFromTimezone) {
      return countryFromTimezone;
    }

    // Method 2: Try IP geolocation service (free tier)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://ipapi.co/country_code/', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const countryCode = await response.text();
        if (countryCode && countryCode.length === 2) {
          return countryCode.toUpperCase();
        }
      }
    } catch (fetchError) {
      console.log('IP geolocation service failed:', fetchError);
    }
  } catch (error) {
    console.log('Geolocation detection failed, assuming non-EU:', error);
  }

  // Fallback: Assume non-EU (safer for user experience)
  return 'US';
}

/**
 * Maps common timezones to country codes
 * @param {string} timezone 
 * @returns {string|null}
 */
function getCountryFromTimezone(timezone) {
  const timezoneMap = {
    'Europe/Madrid': 'ES',
    'Europe/Barcelona': 'ES',
    'Europe/Canary': 'ES',
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Mexico_City': 'MX',
    'America/Bogota': 'CO',
    'America/Lima': 'PE',
    'America/Santiago': 'CL',
    'America/Caracas': 'VE',
    'America/La_Paz': 'BO',
    'America/Asuncion': 'PY',
    'America/Montevideo': 'UY',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT'
  };

  return timezoneMap[timezone] || null;
}

/**
 * Checks if GDPR consent is required for the user's location
 * @param {string} countryCode ISO 3166-1 alpha-2 country code
 * @returns {boolean}
 */
export function isGdprRequired(countryCode) {
  return GDPR_COUNTRIES.includes(countryCode);
}

/**
 * Checks if strict privacy consent is required
 * @param {string} countryCode ISO 3166-1 alpha-2 country code
 * @returns {boolean}
 */
export function isStrictPrivacyRequired(countryCode) {
  return STRICT_PRIVACY_COUNTRIES.includes(countryCode);
}

/**
 * Gets localized privacy policy text based on country
 * @param {string} countryCode ISO 3166-1 alpha-2 country code
 * @returns {object}
 */
export function getPrivacyTexts(countryCode) {
  const isSpanishSpeaking = [
    'ES', 'AR', 'MX', 'CO', 'PE', 'CL', 'VE', 'BO', 'PY', 'UY', 
    'EC', 'GT', 'CU', 'DO', 'HN', 'NI', 'CR', 'PA', 'SV', 'GQ'
  ].includes(countryCode);

  if (isSpanishSpeaking) {
    return {
      title: 'Política de Privacidad y Cookies',
      message: 'Este sitio web utiliza cookies para mejorar tu experiencia de navegación y proporcionar contenido personalizado sobre plantas y jardinería.',
      acceptButton: 'Acepto',
      rejectButton: 'Rechazar',
      settingsButton: 'Configurar',
      learnMore: 'Más información'
    };
  }

  // English fallback
  return {
    title: 'Privacy Policy & Cookies',
    message: 'This website uses cookies to improve your browsing experience and provide personalized content about plants and gardening.',
    acceptButton: 'Accept',
    rejectButton: 'Reject', 
    settingsButton: 'Settings',
    learnMore: 'Learn more'
  };
}

/**
 * Cookie management utilities
 */
export const cookieConsent = {
  STORAGE_KEY: 'gdpr_consent',
  
  getConsent() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  },

  setConsent(consent) {
    const consentData = {
      ...consent,
      timestamp: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consentData));
  },

  hasConsent() {
    return this.getConsent() !== null;
  },

  isConsentValid() {
    const consent = this.getConsent();
    if (!consent) return false;
    
    // Consent expires after 12 months
    const twelveMonths = 365 * 24 * 60 * 60 * 1000;
    return Date.now() - consent.timestamp < twelveMonths;
  },

  clearConsent() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// Debug functions (available globally in browser only)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.gdprDebug = {
    setCountry: (countryCode) => {
      localStorage.setItem('debug-country', countryCode.toUpperCase());
      console.log('🚨 DEBUG: Country set to', countryCode.toUpperCase(), '- Reload page to test');
    },
    
    clearCountry: () => {
      localStorage.removeItem('debug-country');
      console.log('✅ DEBUG: Country override cleared - Reload page');
    },
    
    testMexico: () => window.gdprDebug.setCountry('MX'),
    testArgentina: () => window.gdprDebug.setCountry('AR'),
    testSpain: () => window.gdprDebug.setCountry('ES'),
    testUSA: () => window.gdprDebug.setCountry('US'),
    
    reset: () => {
      cookieConsent.clearConsent();
      localStorage.removeItem('debug-country');
      console.log('🔄 GDPR reset complete - Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    },
    
    status: () => {
      const current = localStorage.getItem('debug-country') || 'auto-detected';
      const consent = cookieConsent.getConsent();
      console.log('🔍 GDPR Debug Status:', { country: current, hasConsent: !!consent, details: consent });
    }
  };
}