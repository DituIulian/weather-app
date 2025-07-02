# 🌤️ Weather App – Modern JavaScript Weather Application

> A complete weather dashboard built with vanilla JavaScript, integrating real-time APIs and offering a smooth user experience with smart error handling and fallback mechanisms.

🔗 [🌐 Live Demo – vremeaazi.netlify.app](https://vremeaazi.netlify.app)  
📂 [🧠 Source Code – GitHub Repo](https://github.com/DituIulian/weather-app)

---

## 🎯 About the Project

**Weather App** is a fully functional client-side application that provides real-time weather data based on city name or the user's current location. It supports internationalization, persistent user preferences, and graceful error handling (e.g. when internet fails or location access is denied).

This project demonstrates a modern development workflow using pure JavaScript, modular architecture, and clean UX/UI practices.

---

## ✨ Features

### 🛠 Core Capabilities

- 🔍 **Search by City Name** – Supports Romanian diacritics & aliases
- 📍 **Use My Location** – Browser Geolocation + IP fallback
- 🕓 **Recent Searches** – Stored in localStorage with quick access
- 🗣️ **Language Selector** – Supports RO, EN, FR, DE
- 🌡️ **Unit Selector** – Metric (°C) or Imperial (°F)
- ⚠️ **Offline Resilience** – Uses fallback data when API fails
- 📱 **Responsive UI** – Looks great on all screen sizes

### 💡 Advanced Functionalities

- Smart Caching Layer _(coming soon)_
- Debounced search _(planned)_
- Logging system with verbosity levels
- Modular structure & configuration via `config.js`

---

## 🛠 Tech Stack

| Technology             | Role                             |
| ---------------------- | -------------------------------- |
| **JavaScript (ES6)**   | Logic, modules, API integration  |
| **HTML5 + CSS3**       | Layout, responsive styling       |
| **Browser APIs**       | Geolocation, LocalStorage, Fetch |
| **OpenWeatherMap**     | Real-time weather data           |
| **IP Geolocation API** | Location fallback                |
| **Netlify**            | Hosting & deployment             |

---

## 🧪 Testing & Validation

Tested manually on:

- ✅ Desktop (Chrome, Firefox, Edge)
- ✅ Mobile emulators (iOS, Android)
- ✅ Offline & slow internet
- ✅ API failure simulations
- ✅ Denied location permission

All user flows have been validated:

- City search
- Location-based weather
- Changing language/unit
- Restoring history from localStorage
- Error messages & graceful fallback

---

## 📚 Resources & Acknowledgements

Throughout the development of this Weather App, I used and learned from a variety of helpful resources:

### 🧠 Learning Platforms

- [GeneratiaTech by Digital Nation](https://learn.generatiatech.ro)
- [freeCodeCamp](https://www.youtube.com/@freecodecamp)
- [Digital Nation – YouTube](https://www.youtube.com/@digitalnationro)

### 🎥 Developer Channels

- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
- [Fireship](https://www.youtube.com/@Fireship)
- [Beyond Fireship](https://www.youtube.com/@beyondfireship)
- [Cosden Solutions](https://www.youtube.com/@cosdensolutions)

### 🌐 Documentation & Tools

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [JavaScript.info](https://javascript.info/)
- [Stack Overflow](https://stackoverflow.com/)
- [ChatGPT](https://chatgpt.com/) – for help with debugging, explanations, and productivity
- [Netlify Docs](https://docs.netlify.com/) – for deployment and hosting

Big thanks to these creators and platforms for sharing their knowledge!

---

## 📸 Screenshots

### ✅ Main interface – Successful search

![Main UI](/screenshots/image.png)

### ⚠️ Error State – Invalid city

![Error](/screenshots/image-1.png)

### ⏳ Loading / Fallback

![Loading](/screenshots/image-2.png)
