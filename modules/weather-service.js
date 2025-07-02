import { CONFIG, API_ENDPOINTS } from './config.js';
import { logger } from './logger.js';

const cache = new Map();

/**
 * Creează un identificator unic pentru cache în funcție de oraș, unități și limbă
 * @param {string} city - Numele orașului
 * @param {string} units - Unitățile de măsură
 * @param {string} lang - Limba descrierii meteo
 * @returns {string} Cheia unică de cache
 */
const getCacheKey = (city, units, lang) => `${city}_${units}_${lang}`.toLowerCase();

/**
 * Verifică dacă o intrare în cache este încă validă
 * @param {Object} entry - Obiectul de cache salvat
 * @returns {boolean} True dacă intrarea este valabilă, altfel false
 */
const isCacheValid = (entry) => {
  if (!entry) return false;
  const age = Date.now() - entry.timestamp;
  return age < CONFIG.CACHE.TTL;
};

/**
 * Obține datele meteo curente pe baza orașului
 * @async
 * @function getCurrentWeather
 * @param {string} city - Numele orașului
 * @returns {Promise<Object>} Obiect cu datele meteo curente
 * @throws {Error} Dacă orașul nu este găsit sau API-ul eșuează
 */

export const getCurrentWeather = async (city) => {
  const units = CONFIG.DEFAULT_UNITS;
  const lang = CONFIG.DEFAULT_LANG;
  const cacheKey = getCacheKey(city, units, lang);

  if (CONFIG.CACHE.ENABLED && isCacheValid(cache.get(cacheKey))) {
    logger.info(`Date din cache pentru ${city}`);
    return cache.get(cacheKey).data;
  }

  const url = `${CONFIG.API_BASE_URL}${API_ENDPOINTS.CURRENT_WEATHER}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Orașul nu a fost găsit.');
      }
      throw new Error('Eroare la încărcarea datelor meteo.');
    }

    const data = await response.json();

    if (CONFIG.CACHE.ENABLED) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    logger.error('Eroare la getCurrentWeather', error);
    throw error;
  }
};

/**
 * Obține datele meteo pe baza coordonatelor geografice
 * @async
 * @function getWeatherByCoords
 * @param {number} lat - Latitudinea
 * @param {number} lon - Longitudinea
 * @returns {Promise<Object>} Obiect cu datele meteo curente
 * @throws {Error} Dacă API-ul eșuează
 */
export const getWeatherByCoords = async (lat, lon) => {
  const units = CONFIG.DEFAULT_UNITS;
  const lang = CONFIG.DEFAULT_LANG;

  const url = `${CONFIG.API_BASE_URL}${API_ENDPOINTS.CURRENT_WEATHER}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Eroare la încărcarea datelor meteo pe coordonate.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Eroare la getWeatherByCoords', error);
    throw error;
  }
};
