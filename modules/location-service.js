// modules/location-service.js
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
  