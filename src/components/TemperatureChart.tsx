import React, { useState } from 'react';
import { DailyForecast } from '../types/weather';
import { formatShortDay } from '../services/weatherApi';

interface TemperatureChartProps {
  daily: DailyForecast;
  unit: 'celsius' | 'fahrenheit';
  selectedIndex: number;
  onSelectDay: (index: number) => void;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  daily,
  unit,
  selectedIndex,
  onSelectDay,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const dates = daily.time;

  if (!maxTemps || !minTemps || maxTemps.length === 0) return null;

  // Calculate scales
  const allTemps = [...maxTemps, ...minTemps];
  const globalMax = Math.max(...allTemps);
  const globalMin = Math.min(...allTemps);
  const range = Math.max(globalMax - globalMin, 1);

  // SVG viewport dimensions
  const svgWidth = 400;
  const svgHeight = 160;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (dates.length <= 1) return paddingX + usableWidth / 2;
    return paddingX + (index / (dates.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const norm = (val - globalMin) / range;
    return paddingTop + usableHeight - norm * usableHeight;
  };

  // Generate points and path strings
  const maxPoints = maxTemps.map((val, idx) => ({ x: getX(idx), y: getY(val), val }));
  const minPoints = minTemps.map((val, idx) => ({ x: getX(idx), y: getY(val), val }));

  const maxPolyline = maxPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const minPolyline = minPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // SVG Area paths for subtle gradient fills under curves
  const maxAreaPath = `M ${maxPoints[0].x},${maxPoints[0].y} ` +
    maxPoints.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${maxPoints[maxPoints.length - 1].x},${svgHeight - paddingBottom} L ${maxPoints[0].x},${svgHeight - paddingBottom} Z`;

  const minAreaPath = `M ${minPoints[0].x},${minPoints[0].y} ` +
    minPoints.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${minPoints[minPoints.length - 1].x},${svgHeight - paddingBottom} L ${minPoints[0].x},${svgHeight - paddingBottom} Z`;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIndex;

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
      id="temperature-chart-card"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            7-Day Temp Trend
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            High / Low Range ({unit === 'fahrenheit' ? '°F' : '°C'})
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-bold font-mono">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            LOW
          </span>
          <span className="flex items-center gap-1.5 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
            HIGH
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative flex-1 flex flex-col justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Orange Max Gradient */}
            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.0" />
            </linearGradient>

            {/* Blue Min Gradient */}
            <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Horizontal Lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={svgWidth - paddingX}
            y2={paddingTop}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + usableHeight / 2}
            x2={svgWidth - paddingX}
            y2={paddingTop + usableHeight / 2}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + usableHeight}
            x2={svgWidth - paddingX}
            y2={paddingTop + usableHeight}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
          />

          {/* Area Fills */}
          <path d={maxAreaPath} fill="url(#maxGradient)" />
          <path d={minAreaPath} fill="url(#minGradient)" />

          {/* Max Temperature Line */}
          <polyline
            fill="none"
            stroke="#fb923c"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={maxPolyline}
            className="filter drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]"
          />

          {/* Min Temperature Line */}
          <polyline
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={minPolyline}
            className="filter drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]"
          />

          {/* Vertical Focus Line for Active Day */}
          {activeIdx >= 0 && activeIdx < dates.length && (
            <line
              x1={getX(activeIdx)}
              y1={paddingTop - 10}
              x2={getX(activeIdx)}
              y2={svgHeight - paddingBottom + 5}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Max Data Circles & Value Labels */}
          {maxPoints.map((p, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <g key={`max-pt-${idx}`} className="cursor-pointer" onClick={() => onSelectDay(idx)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? '6' : '4'}
                  fill="#fb923c"
                  stroke="#020617"
                  strokeWidth="2"
                  className="transition-all hover:scale-125"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="#fb923c"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {Math.round(p.val)}°
                </text>
              </g>
            );
          })}

          {/* Min Data Circles & Value Labels */}
          {minPoints.map((p, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <g key={`min-pt-${idx}`} className="cursor-pointer" onClick={() => onSelectDay(idx)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? '6' : '4'}
                  fill="#60a5fa"
                  stroke="#020617"
                  strokeWidth="2"
                  className="transition-all hover:scale-125"
                />
                <text
                  x={p.x}
                  y={p.y + 16}
                  textAnchor="middle"
                  fill="#60a5fa"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {Math.round(p.val)}°
                </text>
              </g>
            );
          })}
        </svg>

        {/* X-Axis Days Labels */}
        <div className="flex justify-between mt-2 px-1 text-[10px] text-slate-400 font-mono">
          {dates.map((dateStr, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={dateStr}
                onClick={() => onSelectDay(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`transition-colors font-semibold px-1 py-0.5 rounded ${
                  isSelected
                    ? 'text-blue-400 bg-blue-500/20 font-bold underline decoration-blue-400 underline-offset-4'
                    : 'hover:text-white'
                }`}
              >
                {idx === 0 ? 'TOD' : formatShortDay(dateStr)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
