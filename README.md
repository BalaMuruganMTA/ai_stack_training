# Weather Intelligence

**Weather Intelligence** is a predictive atmospheric insights web application built with React, TypeScript, and Tailwind CSS. Styled in a glassmorphic **Immersive UI** dark theme, it leverages the Open-Meteo Geocoding and Forecast APIs to deliver live weather metrics, interactive temperature trend visualizers, a 7-day daily forecast, and 24-hour detailed hourly projections.

---

## Key Features

- **Live City Search & Geocoding**: Search any city worldwide with real-time debounced autocomplete powered by the **Open-Meteo Geocoding API** (`https://geocoding-api.open-meteo.com/v1/search`).
- **Geolocation Integration**: Instantly detect your current coordinates to fetch local weather predictions.
- **Current Atmospheric Metrics**: Clear card displaying real-time temperature, apparent temperature ("feels like"), weather condition description, daytime/nighttime status, wind speed, humidity, UV index category, surface pressure, and coordinate metadata.
- **Interactive 7-Day Temperature Trend**: SVG chart visualizer displaying high (max) and low (min) temperature curves with gradient area fills and clickable data points.
- **7-Day Forecast Grid**: Row of daily cards featuring weather condition emojis, high/low temperature ranges, and precipitation probabilities.
- **24-Hour Hourly Timeline**: Interactive hourly timeline showing hourly temperature, rain chance, and wind speed for any selected day.
- **Unit Toggle & Popular Cities**: Seamlessly switch between Celsius (°C) and Fahrenheit (°F) units, or pick from quick-access popular cities (San Francisco, New York, London, Tokyo, Paris, Sydney).
- **Immersive Glassmorphism UI**: High-contrast dark theme (`#020617`) with glowing ambient backdrops, frosted glass container cards, and responsive micro-interactions.

---

## APIs Used

| Service | Endpoint | Description |
| :--- | :--- | :--- |
| **Open-Meteo Geocoding API** | `https://geocoding-api.open-meteo.com/v1/search` | Converts city queries into exact latitude, longitude, country, and regional metadata. |
| **Open-Meteo Forecast API** | `https://api.open-meteo.com/v1/forecast` | Fetches current weather metrics, 7-day daily forecasts, and 24-hour hourly timelines. |

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Source**: Open-Meteo Public APIs (No API key required)

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### Installation

1. Clone or download the repository.
2. Install dependencies:

```bash
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build & Production

To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

---

## License

Apache-2.0
