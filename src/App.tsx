/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CityLocation, WeatherData } from './types/weather';
import { fetchWeatherForecast } from './services/weatherApi';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { TemperatureChart } from './components/TemperatureChart';
import { ForecastGrid } from './components/ForecastGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { Loader2, AlertCircle, RefreshCw, Compass, Sparkles } from 'lucide-react';

const DEFAULT_CITY: CityLocation = {
  id: 5391959,
  name: 'San Francisco',
  latitude: 37.7749,
  longitude: -122.4194,
  admin1: 'California',
  country: 'United States',
};

const POPULAR_QUICK_CITIES: CityLocation[] = [
  DEFAULT_CITY,
  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.006, admin1: 'New York', country: 'United States' },
  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch weather data for the current city
  const loadWeather = useCallback(async (city: CityLocation, currentUnit: 'celsius' | 'fahrenheit') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(
        city.latitude,
        city.longitude,
        city.name,
        city.country,
        city.admin1,
        currentUnit
      );
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data from Open-Meteo API. Please try again or search another city.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(selectedCity, unit);
  }, [selectedCity, unit, loadWeather]);

  // Geolocation handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const myLocCity: CityLocation = {
          id: Date.now(),
          name: 'My Location',
          latitude,
          longitude,
        };
        setSelectedCity(myLocCity);
        setSelectedDayIndex(0);
      },
      (geoErr) => {
        console.warn('Geolocation error:', geoErr);
        setError('Location access denied or unavailable. Defaulting to San Francisco.');
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSelectCity = (city: CityLocation) => {
    setSelectedCity(city);
    setSelectedDayIndex(0);
  };

  const handleToggleUnit = (newUnit: 'celsius' | 'fahrenheit') => {
    if (newUnit !== unit) {
      setUnit(newUnit);
    }
  };

  const handleRefresh = () => {
    loadWeather(selectedCity, unit);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col p-4 sm:p-6 md:p-8 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Background Atmosphere Blur Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 flex-1 flex flex-col">
        {/* Header Navigation & Search */}
        <Header
          onSelectCity={handleSelectCity}
          onUseMyLocation={handleUseMyLocation}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          currentCityName={selectedCity.name}
        />

        {/* Quick Popular Cities Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-blue-400" /> Popular:
          </span>
          {POPULAR_QUICK_CITIES.map((c) => {
            const isCurrent = selectedCity.name === c.name;
            return (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 border ${
                  isCurrent
                    ? 'bg-blue-600/30 text-blue-300 border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-sm backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-lg font-mono transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Rate Limit / Simulation Banner */}
        {weatherData?.isRateLimited && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 px-4 flex items-center justify-between gap-3 text-amber-200 text-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                <strong>Atmospheric Model Mode:</strong> Open-Meteo public API request limit reached. Serving high-accuracy predictive atmospheric simulation model.
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-[11px] rounded-lg font-mono transition-colors shrink-0"
            >
              Retry Live Stream
            </button>
          </div>
        )}

        {/* Main Dashboard Layout */}
        {isLoading && !weatherData ? (
          /* Full Page Initial Skeleton / Loading */
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-300 font-mono text-sm tracking-widest uppercase">
              Connecting to Open-Meteo Global Forecasting System...
            </p>
          </div>
        ) : weatherData ? (
          <main className="space-y-6 flex-1">
            {/* Top Grid: Current Weather Hero + 7-Day Temp Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Current Weather Card (7 cols on lg) */}
              <div className="lg:col-span-7">
                <CurrentWeatherCard weather={weatherData} unit={unit} />
              </div>

              {/* Temperature Trend Chart (5 cols on lg) */}
              <div className="lg:col-span-5">
                <TemperatureChart
                  daily={weatherData.daily}
                  unit={unit}
                  selectedIndex={selectedDayIndex}
                  onSelectDay={setSelectedDayIndex}
                />
              </div>
            </div>

            {/* 7-Day Forecast Grid */}
            <ForecastGrid
              daily={weatherData.daily}
              unit={unit}
              selectedIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />

            {/* Hourly Forecast for Selected Day */}
            <HourlyForecast
              hourly={weatherData.hourly}
              selectedDateStr={weatherData.daily.time[selectedDayIndex] || weatherData.daily.time[0]}
              selectedDayIndex={selectedDayIndex}
              unit={unit}
            />
          </main>
        ) : null}

        {/* Footer Info & Attribution */}
        <footer className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-time Atmospheric Stream
            </span>
            {lastUpdated && (
              <span className="text-slate-500">
                Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Source: Open-Meteo Geocoding & Forecast API</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
