import React from 'react';
import { HourlyForecastData } from '../types/weather';
import { getWeatherCodeInfo, formatDayName } from '../services/weatherApi';
import { Clock, Droplets, Wind } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastData;
  selectedDateStr: string;
  selectedDayIndex: number;
  unit: 'celsius' | 'fahrenheit';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  selectedDateStr,
  selectedDayIndex,
  unit,
}) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Filter 24 hours corresponding to the selected date string (YYYY-MM-DD)
  const targetDatePrefix = selectedDateStr.split('T')[0];
  const dayIndices: number[] = [];

  hourly.time.forEach((t, i) => {
    if (t.startsWith(targetDatePrefix)) {
      dayIndices.push(i);
    }
  });

  // Fallback to first 24 hours if date prefix match isn't found
  const indicesToDisplay = dayIndices.length > 0 ? dayIndices : Array.from({ length: 24 }, (_, i) => i);

  const windUnitSymbol = unit === 'fahrenheit' ? 'mph' : 'km/h';

  return (
    <div
      className="relative z-10 my-6 bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl"
      id="hourly-forecast-section"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            24-Hour Hourly Details
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-400/30">
            {formatDayName(selectedDateStr, selectedDayIndex)}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-mono">Scroll horizontal →</p>
      </div>

      {/* Hourly Timeline Horizontal Scroll Slider */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {indicesToDisplay.map((hourlyIdx) => {
          const timeISO = hourly.time[hourlyIdx];
          const timeObj = new Date(timeISO);
          const hourLabel = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          const isDay = timeObj.getHours() >= 6 && timeObj.getHours() < 20 ? 1 : 0;

          const temp = Math.round(hourly.temperature_2m[hourlyIdx]);
          const code = hourly.weather_code[hourlyIdx];
          const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[hourlyIdx] : 0;
          const windSpeed = Math.round(hourly.wind_speed_10m[hourlyIdx]);
          const info = getWeatherCodeInfo(code, isDay);

          return (
            <div
              key={timeISO}
              className="min-w-[100px] flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-center flex flex-col justify-between hover:bg-white/10 transition-all hover:scale-[1.03]"
            >
              {/* Hour time */}
              <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                {hourLabel}
              </p>

              {/* Icon & Temp */}
              <div className="my-2">
                <div className="text-2xl mb-1">{info.emoji}</div>
                <div className="text-lg font-light text-white font-mono">{temp}°</div>
              </div>

              {/* Metrics */}
              <div className="pt-2 border-t border-white/5 space-y-1 text-[10px] font-mono">
                {/* Precip */}
                <div className="flex items-center justify-center gap-1 text-blue-300">
                  <Droplets className="w-2.5 h-2.5 text-blue-400" />
                  <span>{precipProb}%</span>
                </div>
                {/* Wind */}
                <div className="flex items-center justify-center gap-1 text-slate-400">
                  <Wind className="w-2.5 h-2.5 text-slate-400" />
                  <span>{windSpeed}{windUnitSymbol}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
