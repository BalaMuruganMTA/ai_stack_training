import React from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherCodeInfo } from '../services/weatherApi';
import { Wind, Droplets, Sun, Gauge, CloudRain, MapPin } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

function getUvIndexCategory(uv: number): string {
  if (uv <= 2) return 'LOW';
  if (uv <= 5) return 'MOD';
  if (uv <= 7) return 'HIGH';
  if (uv <= 10) return 'VERY HIGH';
  return 'EXTREME';
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const current = weather.current;
  const weatherInfo = getWeatherCodeInfo(current.weather_code, current.is_day);
  const tempUnitSymbol = unit === 'fahrenheit' ? '°F' : '°C';
  const windUnitSymbol = unit === 'fahrenheit' ? 'MPH' : 'km/h';

  const fullLocation = [weather.locationName, weather.admin1, weather.country]
    .filter(Boolean)
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join(', ');

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-10 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden min-h-[340px]"
      id="current-weather-card"
    >
      {/* Dynamic Background Glow Accent */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${weatherInfo.bgGradient} blur-3xl opacity-60 pointer-events-none`}
      />

      {/* Decorative Weather Watermark SVG */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-15 text-white pointer-events-none">
        <span className="text-8xl sm:text-9xl select-none">{weatherInfo.emoji}</span>
      </div>

      {/* Top Meta Info */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Currently Viewing
          </span>
          {current.is_day ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30">
              DAY
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              NIGHT
            </span>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-1 drop-shadow-sm flex items-center gap-2 flex-wrap">
          <span>{weather.locationName}</span>
          {weather.admin1 && weather.admin1 !== weather.locationName && (
            <span className="text-slate-400 font-normal text-2xl sm:text-3xl">
              , {weather.admin1}
            </span>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1 font-mono">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          {Math.abs(weather.latitude).toFixed(4)}° {weather.latitude >= 0 ? 'N' : 'S'},{' '}
          {Math.abs(weather.longitude).toFixed(4)}° {weather.longitude >= 0 ? 'E' : 'W'} • Elevated{' '}
          {Math.round(weather.elevation)}m
        </p>
      </div>

      {/* Center Main Temp & Condition */}
      <div className="relative z-10 my-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-7xl sm:text-8xl md:text-9xl font-thin leading-none text-white tracking-tighter">
            {Math.round(current.temperature_2m)}°
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{weatherInfo.emoji}</span>
              <p className="text-xl sm:text-2xl font-medium text-white">{weatherInfo.label}</p>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Feels like <span className="text-slate-200 font-medium">{Math.round(current.apparent_temperature)}°</span>
            </p>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
          {/* Wind */}
          <div className="text-left lg:text-center">
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 flex items-center gap-1 lg:justify-center">
              <Wind className="w-3 h-3 text-blue-400" /> Wind
            </p>
            <p className="text-base sm:text-lg font-mono font-medium text-white">
              {Math.round(current.wind_speed_10m)} <span className="text-xs text-slate-400 font-normal">{windUnitSymbol}</span>
            </p>
          </div>

          {/* Humidity */}
          <div className="text-left lg:text-center">
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 flex items-center gap-1 lg:justify-center">
              <Droplets className="w-3 h-3 text-blue-400" /> Humidity
            </p>
            <p className="text-base sm:text-lg font-mono font-medium text-white">
              {current.relative_humidity_2m}<span className="text-xs text-slate-400 font-normal">%</span>
            </p>
          </div>

          {/* UV Index */}
          <div className="text-left lg:text-center">
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 flex items-center gap-1 lg:justify-center">
              <Sun className="w-3 h-3 text-amber-400" /> UV Index
            </p>
            <p className="text-base sm:text-lg font-mono font-medium text-white">
              {current.uv_index !== undefined ? current.uv_index.toFixed(1) : 'N/A'}{' '}
              <span className="text-[10px] text-amber-400 font-mono">
                {current.uv_index !== undefined ? getUvIndexCategory(current.uv_index) : ''}
              </span>
            </p>
          </div>

          {/* Pressure / Precip */}
          <div className="text-left lg:text-center">
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 flex items-center gap-1 lg:justify-center">
              <Gauge className="w-3 h-3 text-indigo-400" /> Pressure
            </p>
            <p className="text-base sm:text-lg font-mono font-medium text-white">
              {Math.round(current.surface_pressure)} <span className="text-xs text-slate-400 font-normal">hPa</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
