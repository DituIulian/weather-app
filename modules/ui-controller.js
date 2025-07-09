const TRANSLATIONS = {
  ro: {
    humidity: "Umiditate",
    pressure: "Presiune",
    wind: "Vânt",
    visibility: "Vizibilitate",
    sunrise: "Răsărit",
    sunset: "Apus",
    recentSearches: "Căutări recente",
    temperatureFeelsLike: "Se simte ca:",
    temperature: "Temperatură:",
    myLocation: "Locația mea",
    searchPlaceholder: "Introdu un oraș...",
    searchButton: "Caută",
    locationButton: "Locația mea",
    clearHistory: "Șterge istoric",
    title: "Weather App",
    unitLabel: "Unitatea temperaturii:",
    languageLabel: "Limba descrierii:"
  },
  en: {
    humidity: "Humidity",
    pressure: "Pressure",
    wind: "Wind",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    recentSearches: "Recent Searches",
    temperatureFeelsLike: "Feels Like:",
    temperature: "Temperature:",
    myLocation: "My Location",
    searchPlaceholder: "Enter a city...",
    searchButton: "Search",
    locationButton: "My Location",
    clearHistory: "Clear History",
    title: "Weather App",
    unitLabel: "Temperature Unit:",
    languageLabel: "Description Language:"
  },
  fr: {
    humidity: "Humidité",
    pressure: "Pression",
    wind: "Vent",
    visibility: "Visibilité",
    sunrise: "Lever du soleil",
    sunset: "Coucher du soleil",
    recentSearches: "Recherches récentes",
    temperatureFeelsLike: "Ressentie :",
    temperature: "Température :",
    myLocation: "Ma position",
    searchPlaceholder: "Entrez une ville...",
    searchButton: "Chercher",
    locationButton: "Ma position",
    clearHistory: "Effacer l'historique",
    title: "Application météo",
    unitLabel: "Unité de température :",
    languageLabel: "Langue de la description :"
  },
  de: {
    humidity: "Luftfeuchtigkeit",
    pressure: "Luftdruck",
    wind: "Wind",
    visibility: "Sichtweite",
    sunrise: "Sonnenaufgang",
    sunset: "Sonnenuntergang",
    recentSearches: "Kürzliche Suchen",
    temperatureFeelsLike: "Gefühlt:",
    temperature: "Temperatur:",
    myLocation: "Mein Standort",
    searchPlaceholder: "Stadt eingeben...",
    searchButton: "Suchen",
    locationButton: "Mein Standort",
    clearHistory: "Verlauf löschen",
    title: "Wetter App",
    unitLabel: "Temperatureinheit:",
    languageLabel: "Sprache der Beschreibung:"
  }
};


export const elements = {
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector('#search-btn'),
  locationBtn: document.querySelector('#location-btn'),
  loading: document.querySelector('#loading'),
  error: document.querySelector('#error'),
  display: document.querySelector('#weather-display'),
  cityName: document.querySelector('#city-name'),
  temperature: document.querySelector('#temperature'),
  feelsLike: document.querySelector('#feels-like'),
  weatherDesc: document.querySelector('#weather-description'),
  weatherIcon: document.querySelector('#weather-icon'),
  humidity: document.querySelector('#humidity'),
  pressure: document.querySelector('#pressure'),
  windSpeed: document.querySelector('#wind-speed'),
  visibility: document.querySelector('#visibility'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  historyList: document.querySelector('#history-list'),
  clearHistoryBtn: document.querySelector('#clear-history-btn'),
  unitSelect: document.querySelector('#unit-select'),
  langSelect: document.querySelector('#lang-select')
};

export function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.display.classList.add('hidden');
}

export function hideLoading() {
  elements.loading.classList.add('hidden');
}

export function resetUI() {
  hideLoading();
  hideError();
  elements.display.classList.add('hidden');
}

/**
 * Afișează un mesaj de eroare în UI
 * @param {string} message - Mesajul de afișat
 */

export function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.remove('hidden');
  elements.display.classList.add('hidden');
}


/**
 * Afișează un mesaj temporar informativ în partea superioară a aplicației
 * @param {string} message - Mesajul
 * @param {string} [type='info'] - Tipul mesajului (info, warning, error)
 */
export function showMessage(message, type = 'info') {
  const messageElement = document.createElement('div');
  messageElement.classList.add('app-message', `message-${type}`);
  messageElement.textContent = message;

  elements.error.textContent = '';
  elements.error.classList.add('hidden');

  const container = document.querySelector('.app') || document.body;
  container.insertBefore(messageElement, container.firstChild);

  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

export function getCityInput() {
  return elements.cityInput.value.trim();
}

export function clearInput() {
  elements.cityInput.value = '';
}

export function displayWeather(data) {
  hideLoading();
  elements.display.classList.remove('hidden');

  elements.cityName.textContent = data.name;
  elements.temperature.textContent = `${data.main.temp} ${getTemperatureSymbol()}`;
  elements.feelsLike.textContent = `${data.main.feels_like} ${getTemperatureSymbol()}`;
  elements.weatherDesc.textContent = data.weather[0].description;
  elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  elements.weatherIcon.alt = data.weather[0].description;

  elements.humidity.textContent = data.main.humidity;
  elements.pressure.textContent = data.main.pressure;
  elements.windSpeed.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h
  elements.visibility.textContent = data.visibility;

  elements.sunrise.textContent = formatTime(data.sys.sunrise);
  elements.sunset.textContent = formatTime(data.sys.sunset);

  const fallbackBanner = document.getElementById('fallback-indicator');
  if (data.isFallback) {
    fallbackBanner.textContent = `⚠️ Date simulate: ${data.fallbackReason}`;
    fallbackBanner.classList.remove('hidden');
  } else {
    fallbackBanner.classList.add('hidden');
  }
}

function formatTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generează lista de căutări anterioare în UI
 * @param {Array<Object>} history - Lista orașelor salvate
 */
export const renderHistory = (history) => {
  elements.historyList.innerHTML = '';

  if (!history.length) {
    elements.historyList.innerHTML = '<li>Nicio căutare recentă.</li>';
    return;
  }

  history.forEach((item) => {
    const cityName = item.city || 'Oraș necunoscut';
    const temperature = item.temp !== undefined ? `${Math.round(item.temp)}°C` : '';
    const icon = item.icon ? `https://openweathermap.org/img/wn/${item.icon}@2x.png` : '';

    const formattedCity = cityName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const li = document.createElement('li');
    li.classList.add('history-item');
    li.style.cursor = 'pointer';

    li.dataset.city = cityName;
    li.dataset.lat = item.coordinates?.lat || '';
    li.dataset.lon = item.coordinates?.lon || '';

    li.innerHTML = `
      ${icon ? `<img src="${icon}" alt="icon" width="30" style="vertical-align: middle;">` : ''}
      <strong>${formattedCity}</strong>${temperature ? `: ${temperature}` : ''}
    `;

    elements.historyList.appendChild(li);
  });
};



export function hideError() {
  elements.error.classList.add('hidden');
}

/**
 * Returnează simbolul pentru unitatea temperaturii curente
 * @returns {string} °C sau °F
 */
const getTemperatureSymbol = () => {
  return localStorage.getItem('weather-unit') === 'imperial' ? '°F' : '°C';
};

/**
 * Salvează preferințele utilizatorului (unități și limbă)
 * @param {string} unit - 'metric' sau 'imperial'
 * @param {string} lang - codul limbii (ro, en, fr, de)
 */
export const saveUserPreferences = (unit, lang) => {
  localStorage.setItem('weather-unit', unit);
  localStorage.setItem('weather-lang', lang);
};

/**
 * Încarcă preferințele salvate de utilizator
 * @returns {{ unit: string, lang: string }}
 */
export const loadUserPreferences = () => {
  return {
    unit: localStorage.getItem('weather-unit') || 'metric',
    lang: localStorage.getItem('weather-lang') || 'ro'
  };
};

/**
 * Actualizează etichetele statice în funcție de limba selectată
 * @param {string} lang - codul limbii (ro, en, fr, de)
 */
export function updateStaticLabels(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ro;

  const labels = {
    'label-temperature': '🌡️ ' + t.temperature ,
    'label-feels-like': '🤔 ' + t.temperatureFeelsLike,
    'label-humidity': '💧 ' + t.humidity + ': ',
    'label-pressure': '📏 ' + t.pressure + ': ',
    'label-wind': '🌬️ ' + t.wind + ': ',
    'label-visibility': '👀 ' + t.visibility + ': ',
    'label-sunrise': '🌅 ' + t.sunrise + ': ',
    'label-sunset': '🌇 ' + t.sunset + ': ',
    'label-my-location': t.myLocation + ': ',
    'recent-searches-title': '🕓 ' + t.recentSearches
  };

  
  for (const [id, text] of Object.entries(labels)) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

 
  if (elements.cityInput) elements.cityInput.placeholder = t.searchPlaceholder;
  if (elements.searchBtn) elements.searchBtn.textContent = '🔍 ' + t.searchButton;
  if (elements.locationBtn) elements.locationBtn.innerHTML = `📍 ${t.locationButton}`;
  if (elements.clearHistoryBtn) elements.clearHistoryBtn.textContent = t.clearHistory;
  


  const appTitle = document.querySelector('h1');
  if (appTitle) appTitle.innerHTML = `${t.title} <span>🌦️</span>`;

  const unitLabel = document.querySelector('label[for="unit-select"]');
  if (unitLabel) unitLabel.textContent = t.unitLabel;

  const langLabel = document.querySelector('label[for="lang-select"]');
  if (langLabel) langLabel.textContent = t.languageLabel;
}


/**
 * Adaugă evenimente pe istoricul căutărilor
 * @param {Function} onHistoryClick - Funcție apelată când se dă click pe o locație
 * @param {Function} onClearHistory - Funcție apelată când se șterge istoricul
 */
export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
  elements.historyList.addEventListener('click', onHistoryClick);
  elements.clearHistoryBtn.addEventListener('click', onClearHistory);
};