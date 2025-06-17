import { API_KEY } from './config.js';

export const getCurrentWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ro`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Orașul nu a fost găsit.');
    } else {
      throw new Error('Eroare la obținerea datelor meteo.');
    }
  }

  return await response.json();
};


export const getWeatherByCoords = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ro`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Nu s-au putut obține datele după locație.');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Eroare la obținerea datelor meteo.');
  }
};
