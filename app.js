import { getCurrentWeather, getWeatherByCoords } from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';

const setupEventListeners = () => {
    ui.elements.searchBtn.addEventListener('click', handleSearch);
    ui.elements.clearHistoryBtn.addEventListener('click', clearHistory);
  ui.elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  ui.elements.locationBtn.addEventListener('click', handleLocation);
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
    ui.showError(error.message); // aici e clar mesajul final
  }
};


const handleLocation = () => {
    if (!navigator.geolocation) {
      ui.showError('Geolocalizarea nu este suportată de acest browser.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const data = await getWeatherByCoords(latitude, longitude);
            ui.resetUI();
            ui.hideError();
          ui.displayWeather(data);
        } catch (error) {
          ui.resetUI();
            
          ui.showError('Nu am putut obține datele meteo pentru locația ta.');
        }
      },
      () => {
        ui.resetUI();
        ui.showError('Permisiunea de locație a fost refuzată.');
      }
    );
  };
  

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

const saveToHistory = (city) => {
  const key = 'weather-history';
  let history = JSON.parse(localStorage.getItem(key)) || [];

  city = city.toLowerCase();
  history = history.filter((item) => item !== city); // evită duplicate
  history.unshift(city); // adaugă în față
  if (history.length > 5) history.pop(); // max 5

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

// Pornește aplicația
setupEventListeners();
loadHistory();
