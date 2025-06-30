import { CONFIG } from './config.js';
import { logger } from './logger.js';

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
  }

  addLocation(weatherData) {
   
    if (
      !weatherData ||
      typeof weatherData.name !== 'string' ||
      !weatherData.coord ||
      typeof weatherData.coord.lat !== 'number' ||
      typeof weatherData.coord.lon !== 'number'
    ) {
      logger.warn('Date invalide. Nu se adaugă în istoric.', weatherData);
      return;
    }

    const city = weatherData.name;
    const country = weatherData.sys?.country || 'N/A';
    const coordinates = weatherData.coord;
    const timestamp = Date.now();

    const newEntry = {
        city,
        country,
        coordinates,
        timestamp,
        temp: weatherData.main.temp,
        icon: weatherData.weather?.[0]?.icon || '',
      };
      

    let history = this._loadFromStorage();

    
    const existingIndex = history.findIndex(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    );
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1); 
    }

    history.unshift(newEntry); 

    if (history.length > this.maxItems) {
      history = history.slice(0, this.maxItems); 
    }

    this._saveToStorage(history);
    logger.info('Locație salvată în istoric', newEntry);
  }

  getHistory() {
    const all = this._loadFromStorage();
  
    // Filtrăm doar intrările valide (cu city, coordonate, temperatură și icon)
    const valid = all.filter(item =>
      item.city &&
      item.coordinates &&
      typeof item.coordinates.lat === 'number' &&
      typeof item.coordinates.lon === 'number' &&
      typeof item.temp === 'number' &&
      typeof item.icon === 'string'
    );
  
    if (valid.length !== all.length) {
      logger.warn('Unele intrări invalide au fost eliminate din istoric');
      this._saveToStorage(valid); // curățăm și în storage
    }
  
    return valid;
  }
  

  removeLocation(city) {
    let history = this._loadFromStorage();
    history = history.filter(
      (item) => item.city.toLowerCase() !== city.toLowerCase()
    );
    this._saveToStorage(history);
    logger.info(`Locația ${city} a fost ștearsă din istoric`);
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
    logger.warn('Tot istoricul a fost șters');
  }

  _saveToStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      logger.error('Eroare la salvarea istoricului', error);
    }
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      logger.error('Eroare la citirea istoricului', error);
      return [];
    }
  }
}

export const historyService = new HistoryService();
