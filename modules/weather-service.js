import { CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './config.js';
import { MOCK_DATA } from './mock-data.js';

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(CONFIG.API_BASE_URL + endpoint);
  url.searchParams.set('appid', CONFIG.API_KEY);
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS);
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
};

const makeRequest = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
      }
      if (response.status === 401) {
        throw new Error(ERROR_MESSAGES.INVALID_KEY);
      }
      throw new Error(ERROR_MESSAGES.GENERIC);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NO_NETWORK);
    }
    throw err;
  }
};

export const getCurrentWeather = async (city) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });

  try {
    return await makeRequest(url);
  } catch (error) {
    console.warn('Folosim fallback pentru oraș:', city, '-', error.message);
    return {
      ...MOCK_DATA,
      name: city,
      isFallback: true,
      fallbackReason: error.message,
    };
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });

  try {
    return await makeRequest(url);
  } catch (error) {
    console.warn('Folosim fallback pentru coordonate:', lat, lon, '-', error.message);
    return {
      ...MOCK_DATA,
      name: `Lat: ${lat}, Lon: ${lon}`,
      isFallback: true,
      fallbackReason: error.message,
    };
  }
};
