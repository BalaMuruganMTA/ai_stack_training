import React from 'react';
import { DailyForecast } from '../types/weather';
import { getWeatherCodeInfo, formatDayName } from '../services/weatherApi';

interface ForecastGridProps {
  daily: DailyForecast;
  unit: 'celsius' | 'fahrenheit';
  selectedIndex: number;
  onSelectDay: (index: number) => void;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  unit,
  selectedIndex,
  onSelectDay,
}) => {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  return (
    <div className="relative z-10 my-6" id="forecast-grid-section">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          7-Day Forecast
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          Click any day to view detailed hourly metrics
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {daily.time.map((dateStr, idx) => {
          const maxTemp = Math.round(daily.temperature_2m_max[idx]);
          const minTemp = Math.round(daily.temperature_2m_min[idx]);
          const weatherCode = daily.weather_code[idx];
          const precipProb = daily.precipitation_probability_max
            ? daily.precipitation_probability_max[idx]
            : null;
          const precipSum = daily.precipitation_sum ? daily.precipitation_sum[idx] : 0;
          const info = getWeatherCodeInfo(weatherCode, 1);
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(idx)}
              className={`text-left transition-all p-4 rounded-2xl border backdrop-blur-md cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/10 border-blue-500/50 ring-2 ring-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
              id={`forecast-card-${idx}`}
            >
              {/* Day Name */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                  {formatDayName(dateStr, idx)}
                </p>

                {/* Weather Emoji & Condition Label */}
                <div className="text-3xl my-2 flex items-center justify-between">
                  <span>{info.emoji}</span>
                  <span className="text-[10px] text-slate-400 font-mono hidden group-hover:inline-block">
                    Code {weatherCode}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-300 line-clamp-1 mb-2">
                  {info.label}
                </p>
              </div>

              {/* Temperatures */}
              <div>
                <div className="text-xl font-light text-white font-mono tracking-tight">
                  {maxTemp}°
                  <span className="text-sm text-slate-400 font-normal"> / {minTemp}°</span>
                </div>

                {/* Rain / Precip probability footer */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-mono uppercase tracking-tight text-blue-300">
                    {precipProb !== null ? `${precipProb}% Rain` : `${precipSum.toFixed(1)}mm`}
                  </p>
                  {precipProb !== null && precipProb > 40 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
