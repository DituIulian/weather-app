import { getCurrentWeather, getWeatherByCoords } from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import { getCoords } from './modules/location-service.js';
import { CONFIG } from './modules/config.js';

const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener('click', handleSearch);
  ui.elements.clearHistoryBtn.addEventListener('click', clearHistory);
  ui.elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  ui.elements.locationBtn.addEventListener('click', handleLocation);

  ui.elements.unitSelect.addEventListener('change', async (e) => {
    CONFIG.DEFAULT_UNITS = e.target.value;
    const lang = ui.elements.langSelect.value;
    ui.saveUserPreferences(CONFIG.DEFAULT_UNITS, lang);

    const lastSearch = JSON.parse(localStorage.getItem('weather-history'))?.[0];
    if (lastSearch) {
      try {
        const data = await getCurrentWeather(lastSearch);
        ui.resetUI();
        ui.displayWeather(data);
      } catch (error) {
        ui.showError('Eroare la reîncărcarea datelor.');
      }
    }
  });

  ui.elements.langSelect.addEventListener('change', async (e) => {
    CONFIG.DEFAULT_LANG = e.target.value;
    const unit = ui.elements.unitSelect.value;
    ui.saveUserPreferences(unit, CONFIG.DEFAULT_LANG);

    const lastSearch = JSON.parse(localStorage.getItem('weather-history'))?.[0];
    if (lastSearch) {
      try {
        const data = await getCurrentWeather(lastSearch);
        ui.resetUI();
        ui.displayWeather(data);
      } catch (error) {
        ui.showError('Eroare la reîncărcarea datelor.');
      }
    }
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
    const data = await getCurrentWeather(city);
    ui.resetUI();
    ui.displayWeather(data);
    ui.clearInput();
    saveToHistory(city);
  } catch (error) {
    ui.resetUI();
    ui.showError(error.message);
  }
};

const handleLocation = async () => {
  ui.resetUI();
  ui.showLoading('Detectez locația...');

  try {
    const coords = await getCoords();

    if (coords.source === 'ip') {
      ui.showMessage('Locație aproximativă bazată pe IP', 'warning');
    }

    ui.showLoading('Încarc vremea...');
    const data = await getWeatherByCoords(coords.latitude, coords.longitude);

    ui.resetUI();
    ui.displayWeather(data);
    saveToHistory(data.name); 
  } catch (error) {
    ui.resetUI();
    ui.showError(`Locația nu a putut fi determinată: ${error.message}`);
  }
};

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

const saveToHistory = (city) => {
  const key = 'weather-history';
  let history = JSON.parse(localStorage.getItem(key)) || [];

  city = city.toLowerCase();
  history = history.filter((item) => item !== city);
  history.unshift(city);
  if (history.length > 5) history.pop();

  localStorage.setItem(key, JSON.stringify(history));
  ui.renderHistory(history);
};

const loadHistory = () => {
  const history = JSON.parse(localStorage.getItem('weather-history')) || [];
  ui.renderHistory(history);
};

const clearHistory = () => {
  if (confirm("Sigur vrei să ștergi istoricul?")) {
    localStorage.removeItem('weather-history');
    ui.renderHistory([]);
  }
};

// Initializează aplicația
const initializeApp = () => {
  const prefs = ui.loadUserPreferences();
  CONFIG.DEFAULT_UNITS = prefs.unit;
  CONFIG.DEFAULT_LANG = prefs.lang;

  ui.elements.unitSelect.value = prefs.unit;
  ui.elements.langSelect.value = prefs.lang;

  setupEventListeners();
  loadHistory();
};

initializeApp();
