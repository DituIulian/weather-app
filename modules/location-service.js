/**
 * Obține coordonatele geografice ale utilizatorului.
 * Încearcă mai întâi cu Geolocation API, apoi face fallback la IP.
 * 
 * @function getCoords
 * @async
 * @returns {Promise<{ latitude: number, longitude: number, source: 'gps'|'ip', accuracy: 'precise'|'approximate' }>}
 * Coordonatele obținute și sursa lor (gps sau ip).
 * 
 * @throws {Error} Dacă niciuna dintre metode nu funcționează.
 *
 * @example
 * const coords = await getCoords();
 * console.log(coords.latitude, coords.longitude);
 */


export const getCoords = () => new Promise((resolve, reject) => {
    const fallbackToIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        resolve({
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'ip',
          accuracy: 'approximate'
        });
      } catch (error) {
        reject(new Error('Nu am putut obține locația (nici prin IP).'));
      }
    };
  
    if (!navigator.geolocation) {
      return fallbackToIp();
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: 'gps',
          accuracy: 'precise'
        });
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        fallbackToIp();
      },
      {
        timeout: 5000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }
    );
  });
  