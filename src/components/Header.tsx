import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Thermometer, Loader2, X, RefreshCw } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  onSelectCity: (city: CityLocation) => void;
  onUseMyLocation: () => void;
  unit: 'celsius' | 'fahrenheit';
  onToggleUnit: (unit: 'celsius' | 'fahrenheit') => void;
  isLoading: boolean;
  onRefresh: () => void;
  currentCityName?: string;
}

const POPULAR_CITIES: { name: string; admin1?: string; country: string; lat: number; lon: number }[] = [
  { name: 'San Francisco', admin1: 'California', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { name: 'New York', admin1: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
];

export const Header: React.FC<HeaderProps> = ({
  onSelectCity,
  onUseMyLocation,
  unit,
  onToggleUnit,
  isLoading,
  onRefresh,
  currentCityName,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error searching cities:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <header className="relative z-30 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Brand Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            WEATHER INTELLIGENCE
          </h1>
        </div>
        <p className="text-slate-400 text-xs md:text-sm mt-0.5 font-mono">
          Predictive Atmospheric Insights • Live Geocoding
        </p>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar Container */}
        <div className="relative flex-1 sm:w-80 md:w-96" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder="Search city (e.g. San Francisco, Tokyo)..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-11 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all"
              id="city-search-input"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : isSearching ? (
              <Loader2 className="absolute right-3.5 w-4 h-4 text-blue-400 animate-spin" />
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl z-50 max-h-72 overflow-y-auto divide-y divide-white/5">
              {suggestions.length > 0 ? (
                suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-600/20 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  No location results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Geolocation & Unit Switcher */}
        <div className="flex items-center gap-2">
          {/* Current Location Button */}
          <button
            onClick={onUseMyLocation}
            disabled={isLoading}
            className="p-2.5 bg-white/10 border border-white/20 rounded-full text-slate-300 hover:text-white hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            title="Use current geolocation"
            id="my-location-btn"
          >
            <Compass className="w-4 h-4 text-blue-400" />
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 bg-white/10 border border-white/20 rounded-full text-slate-300 hover:text-white hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            title="Refresh weather data"
            id="refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* C / F Unit Toggle */}
          <div className="flex bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-md">
            <button
              onClick={() => onToggleUnit('celsius')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                unit === 'celsius'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="celsius-btn"
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="fahrenheit-btn"
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
