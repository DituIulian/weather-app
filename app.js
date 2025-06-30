import { getCurrentWeather, getWeatherByCoords } from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import { getCoords } from './modules/location-service.js';
import { CONFIG } from './modules/config.js';
import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';

// 🔁 DECLARĂM PRIMA DATA HANDLEHISTORYCLICK!
const handleHistoryClick = async (event) => {
  const item = event.target.closest('.history-item');
  if (!item) return;

  const city = item.dataset.city;
  const lat = parseFloat(item.dataset.lat);
  const lon = parseFloat(item.dataset.lon);

  logger.info('Istoric selectat', { city, lat, lon });

  try {
    ui.showLoading();
    const data = await getWeatherByCoords(lat, lon);

    logger.info('Date meteo încărcate din istoric', {
      oras: data.name,
      temperatura: data.main.temp,
    });

    ui.resetUI();
    ui.displayWeather(data);

    historyService.addLocation(data);
    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);
  } catch (error) {
    ui.resetUI();
    ui.showError('Eroare la încărcarea din istoric.');
    logger.error('Eroare la click pe istoric', error);
  }
};

const setupEventListeners = () => {
  ui.addHistoryEventListeners(handleHistoryClick, clearHistory);
  ui.elements.clearHistoryBtn.addEventListener('click', clearHistory);
  document.querySelector('#search-form').addEventListener('submit', (e) => {
    e.preventDefault(); 
    handleSearch();
  });
  ui.elements.locationBtn.addEventListener('click', handleLocation);

  ui.elements.unitSelect.addEventListener('change', async (e) => {
    CONFIG.DEFAULT_UNITS = e.target.value;
    const lang = ui.elements.langSelect.value;
    ui.saveUserPreferences(CONFIG.DEFAULT_UNITS, lang);
    ui.updateStaticLabels(CONFIG.DEFAULT_LANG);

    const lastSearch = getLastSearch();
    if (lastSearch) await refreshData(lastSearch);
  });

  ui.elements.langSelect.addEventListener('change', async (e) => {
    CONFIG.DEFAULT_LANG = e.target.value;
    const unit = ui.elements.unitSelect.value;
    ui.saveUserPreferences(unit, CONFIG.DEFAULT_LANG);
    ui.updateStaticLabels(CONFIG.DEFAULT_LANG);

    const lastSearch = getLastSearch();
    if (lastSearch) await refreshData(lastSearch);
  });
};

const handleSearch = async () => {
  let city = ui.getCityInput();

  if (!isValidCity(city)) {
    ui.showError('Introdu un nume de oraș valid.');
    return;
  }

  city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const aliasMap = {
    'bucuresti': 'bucurești',
    'iasi': 'iași',
    'cluj napoca': 'cluj-napoca'
  };
  const normalizedCity = city.toLowerCase();
  if (aliasMap[normalizedCity]) {
    city = aliasMap[normalizedCity];
  }

  try {
    logger.info('Căutare inițiată', { city });
    const data = await getCurrentWeather(city);
    logger.debug('Date meteo primite', data);

    ui.resetUI();
    ui.displayWeather(data);
    ui.clearInput();

    historyService.addLocation(data);
    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);

    logger.info('Datele au fost afișate cu succes', {
      oras: data.name,
      temperatura: data.main.temp,
    });
  } catch (error) {
    ui.resetUI();
    logger.error('Eroare la căutarea orașului', error);
    ui.showError(error.message);
  }
};

const handleLocation = async () => {
  ui.resetUI();
  ui.showLoading('Detectez locația...');

  try {
    logger.info('Se detectează locația curentă');

    const coords = await getCoords();

    if (coords.source === 'ip') {
      ui.showMessage('Locație aproximativă bazată pe IP', 'warning');
    }

    ui.showLoading('Încarc vremea...');
    const data = await getWeatherByCoords(coords.latitude, coords.longitude);

    logger.info('Date meteo primite pe baza locației', {
      oras: data.name,
      coordonate: { lat: data.coord.lat, lon: data.coord.lon },
    });

    ui.resetUI();
    ui.displayWeather(data);

    historyService.addLocation(data);
    const updatedHistory = historyService.getHistory();
    ui.renderHistory(updatedHistory);

  } catch (error) {
    ui.resetUI();
    ui.showError(`Locația nu a putut fi determinată: ${error.message}`);
    logger.error('Eroare la detectarea locației', error);
  }
};

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

const loadHistory = () => {
  const history = historyService.getHistory();
  ui.renderHistory(history);
};

const clearHistory = () => {
  if (confirm("Sigur vrei să ștergi istoricul?")) {
    historyService.clearHistory();
    ui.renderHistory([]);
    logger.info('History cleared by user');
  }
};

const getLastSearch = () => {
  const history = historyService.getHistory();
  return history[0]?.city || null;
};

const refreshData = async (city) => {
  try {
    const data = await getCurrentWeather(city);
    ui.resetUI();
    ui.displayWeather(data);
  } catch (error) {
    ui.resetUI();
    ui.showError('Eroare la reîncărcarea datelor.');
    logger.error('Failed to refresh data', error);
  }
};

const initializeApp = () => {
  logger.info('Initializing Weather App...');

  const prefs = ui.loadUserPreferences();
  CONFIG.DEFAULT_UNITS = prefs.unit;
  CONFIG.DEFAULT_LANG = prefs.lang;

  ui.elements.unitSelect.value = prefs.unit;
  ui.elements.langSelect.value = prefs.lang;

  ui.updateStaticLabels(CONFIG.DEFAULT_LANG);

  setupEventListeners();
  loadHistory();

  const lastSearch = getLastSearch();
  if (lastSearch) {
    logger.debug('Se încarcă ultimul oraș căutat', { lastSearch });
    refreshData(lastSearch);
  }

  logger.info('App initialized successfully');
};

initializeApp();
