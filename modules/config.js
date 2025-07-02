const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const isProduction = window.location.hostname.includes('github.io');

export const CONFIG = {
  API_KEY: 'cbf0bd33c8de635efc2ad968178bdea9', // TODO: Ascunde prin proxy
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',


  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'ro',


  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    USER_PREFERENCES: 'weather_user_prefs',
  },

  
  LOGGING: {
    ENABLED: isLocalhost, 
    LEVEL: isLocalhost ? 'debug' : 'error',
    MAX_LOGS: 100,
  },


  CACHE: {
    ENABLED: true,
    TTL: 10 * 60 * 1000 
  }
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Orașul nu a fost găsit. Verifică denumirea.',
  NETWORK_ERROR: 'Conexiune eșuată. Verifică internetul.',
  PERMISSION_DENIED: 'Accesul la locație a fost refuzat.',
  LOCATION_FAILED: 'Locația nu a putut fi determinată.',
  UNKNOWN_ERROR: 'A apărut o eroare necunoscută.',
};
