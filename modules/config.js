// modules/config.js

export const CONFIG = {
    API_KEY: 'cbf0bd33c8de635efc2ad968178bdea9',
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_UNITS: 'metric',
    DEFAULT_LANG: 'ro',
  };
  
  export const API_ENDPOINTS = {
    CURRENT_WEATHER: '/weather',
    FORECAST: '/forecast', // (pentru extensii viitoare)
  };
  
  export const ERROR_MESSAGES = {
    CITY_NOT_FOUND: 'Orașul nu a fost găsit. Verifică denumirea.',
    NETWORK_ERROR: 'Conexiune eșuată. Verifică internetul.',
    PERMISSION_DENIED: 'Accesul la locație a fost refuzat.',
    LOCATION_FAILED: 'Locația nu a putut fi determinată.',
    UNKNOWN_ERROR: 'A apărut o eroare necunoscută.',
  };
  