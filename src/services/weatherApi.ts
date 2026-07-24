import { CityLocation, CurrentWeather, GeocodingResponse, WeatherCodeInfo, WeatherData } from '../types/weather';

export function getWeatherCodeInfo(code: number, isDay = 1): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        emoji: isDay ? '☀️' : '🌙',
        bgGradient: 'from-amber-500/20 to-orange-500/10',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        emoji: isDay ? '🌤️' : '🌙',
        bgGradient: 'from-blue-400/20 to-cyan-500/10',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        emoji: '⛅',
        bgGradient: 'from-slate-400/20 to-blue-500/10',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        iconName: 'Cloud',
        emoji: '☁️',
        bgGradient: 'from-slate-500/20 to-gray-600/10',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 45 ? 'Fog' : 'Depositing Rime Fog',
        iconName: 'CloudFog',
        emoji: '🌫️',
        bgGradient: 'from-teal-500/20 to-slate-600/10',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: 'Drizzle',
        iconName: 'CloudDrizzle',
        emoji: '🌧️',
        bgGradient: 'from-blue-500/20 to-indigo-500/10',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        iconName: 'CloudSnow',
        emoji: '🌨️',
        bgGradient: 'from-cyan-500/20 to-blue-600/10',
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        iconName: 'CloudRain',
        emoji: '🌧️',
        bgGradient: 'from-blue-600/20 to-indigo-700/10',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        emoji: '🌧️❄️',
        bgGradient: 'from-sky-600/20 to-indigo-800/10',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snow',
        iconName: 'Snowflake',
        emoji: '❄️',
        bgGradient: 'from-sky-300/20 to-indigo-400/10',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        iconName: 'Snowflake',
        emoji: '🌨️',
        bgGradient: 'from-slate-300/20 to-blue-400/10',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: 'Rain Showers',
        iconName: 'CloudRainWind',
        emoji: '🌦️',
        bgGradient: 'from-indigo-500/20 to-blue-600/10',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        emoji: '🌨️',
        bgGradient: 'from-sky-400/20 to-indigo-500/10',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        emoji: '⛈️',
        bgGradient: 'from-amber-600/20 to-purple-800/10',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        iconName: 'CloudHail',
        emoji: '⛈️🧊',
        bgGradient: 'from-purple-600/20 to-red-900/10',
      };
    default:
      return {
        code,
        label: 'Variable Weather',
        iconName: 'Sun',
        emoji: '🌤️',
        bgGradient: 'from-blue-500/20 to-indigo-500/10',
      };
  }
}

// Offline fallback city registry for fallback searching when API limits (429) occur
const FALLBACK_CITIES: CityLocation[] = [
  { id: 5391959, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, admin1: 'California', country: 'United States' },
  { id: 5128581, name: 'New York', latitude: 40.7128, longitude: -74.006, admin1: 'New York', country: 'United States' },
  { id: 5368361, name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, admin1: 'California', country: 'United States' },
  { id: 4887398, name: 'Chicago', latitude: 41.85, longitude: -87.65, admin1: 'Illinois', country: 'United States' },
  { id: 4164138, name: 'Miami', latitude: 25.7743, longitude: -80.1937, admin1: 'Florida', country: 'United States' },
  { id: 5809844, name: 'Seattle', latitude: 47.6062, longitude: -122.3321, admin1: 'Washington', country: 'United States' },
  { id: 2643743, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
  { id: 2988507, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
  { id: 2950159, name: 'Berlin', latitude: 52.5244, longitude: 13.4105, country: 'Germany' },
  { id: 3169070, name: 'Rome', latitude: 41.8919, longitude: 12.5113, country: 'Italy' },
  { id: 3117735, name: 'Madrid', latitude: 40.4165, longitude: -3.7026, country: 'Spain' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { id: 1816670, name: 'Beijing', latitude: 39.9075, longitude: 116.3972, country: 'China' },
  { id: 1796236, name: 'Shanghai', latitude: 31.2222, longitude: 121.4581, country: 'China' },
  { id: 1880252, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  { id: 2147714, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
  { id: 2158177, name: 'Melbourne', latitude: -37.814, longitude: 144.9633, country: 'Australia' },
  { id: 292223, name: 'Dubai', latitude: 25.2582, longitude: 55.3047, country: 'United Arab Emirates' },
  { id: 6167865, name: 'Toronto', latitude: 43.7001, longitude: -79.4163, admin1: 'Ontario', country: 'Canada' },
  { id: 6173331, name: 'Vancouver', latitude: 49.2497, longitude: -123.1193, admin1: 'British Columbia', country: 'Canada' },
  { id: 1275339, name: 'Mumbai', latitude: 19.0728, longitude: 72.8826, admin1: 'Maharashtra', country: 'India' },
  { id: 1273294, name: 'Delhi', latitude: 28.6519, longitude: 77.2315, country: 'India' },
  { id: 3448439, name: 'São Paulo', latitude: -23.5475, longitude: -46.6361, country: 'Brazil' },
  { id: 360630, name: 'Cairo', latitude: 30.0626, longitude: 31.2497, country: 'Egypt' },
];

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=10&language=en&format=json`;

    const response = await fetch(url);
    if (response.ok) {
      const data: GeocodingResponse = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('Open-Meteo geocoding search failed or rate-limited. Using offline city fallback:', err);
  }

  // Fallback to searching offline cities list
  return FALLBACK_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQuery) ||
      (c.country && c.country.toLowerCase().includes(cleanQuery)) ||
      (c.admin1 && c.admin1.toLowerCase().includes(cleanQuery))
  );
}

function generateFallbackWeatherData(
  lat: number,
  lon: number,
  locationName: string,
  country?: string,
  admin1?: string,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): WeatherData {
  const isFahrenheit = unit === 'fahrenheit';
  const month = new Date().getMonth(); // 0-11
  const isNorthern = lat >= 0;

  // Base climate temperature estimation
  let baseTempC = 24 - (Math.abs(lat) / 90) * 22; // Equator ~24C, Poles ~2C
  // Seasonal variance
  const seasonalOffset = isNorthern
    ? Math.cos(((month - 6) * Math.PI) / 6) * -6
    : Math.cos(((month - 6) * Math.PI) / 6) * 6;
  baseTempC += seasonalOffset;

  const toUnitTemp = (c: number) => (isFahrenheit ? (c * 9) / 5 + 32 : c);
  const baseTemp = toUnitTemp(baseTempC);

  // Generate 7 daily entries
  const dailyTime: string[] = [];
  const dailyMax: number[] = [];
  const dailyMin: number[] = [];
  const dailyWeatherCode: number[] = [];
  const dailyPrecipSum: number[] = [];
  const dailyPrecipProb: number[] = [];
  const dailyWindMax: number[] = [];
  const dailyUvMax: number[] = [];

  const possibleCodes = [0, 1, 2, 3, 61, 80];

  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    dailyTime.push(dateStr);

    const variance = Math.sin(i * 1.5 + lat) * 4;
    const max = baseTemp + variance + 3;
    const min = baseTemp + variance - 5;
    dailyMax.push(Math.round(max * 10) / 10);
    dailyMin.push(Math.round(min * 10) / 10);

    const codeIdx = Math.abs(Math.floor(Math.sin(i + lon) * possibleCodes.length)) % possibleCodes.length;
    const code = possibleCodes[codeIdx];
    dailyWeatherCode.push(code);

    const hasRain = code >= 50;
    dailyPrecipSum.push(hasRain ? Math.round((Math.abs(Math.sin(i * 2)) * 8 + 1) * 10) / 10 : 0);
    dailyPrecipProb.push(hasRain ? Math.round(40 + Math.abs(Math.sin(i)) * 50) : Math.round(Math.abs(Math.sin(i)) * 15));

    const windBase = isFahrenheit ? 10 : 15;
    dailyWindMax.push(Math.round((windBase + Math.abs(Math.cos(i)) * 12) * 10) / 10);
    dailyUvMax.push(Math.round((Math.max(1, 8 - (Math.abs(lat) / 90) * 6) + Math.sin(i)) * 10) / 10);
  }

  // Generate 24x7 hourly entries
  const hourlyTime: string[] = [];
  const hourlyTemp: number[] = [];
  const hourlyHumidity: number[] = [];
  const hourlyPrecipProb: number[] = [];
  const hourlyWeatherCode: number[] = [];
  const hourlyWindSpeed: number[] = [];
  const hourlyUvIndex: number[] = [];

  for (let d = 0; d < 7; d++) {
    const dayDate = dailyTime[d];
    const dayMax = dailyMax[d];
    const dayMin = dailyMin[d];

    for (let h = 0; h < 24; h++) {
      const padHour = h < 10 ? `0${h}` : `${h}`;
      hourlyTime.push(`${dayDate}T${padHour}:00`);

      // Diurnal temperature wave peaking at 15:00
      const hourFactor = Math.sin(((h - 9) * Math.PI) / 12);
      const temp = dayMin + ((dayMax - dayMin) / 2) * (1 + hourFactor);
      hourlyTemp.push(Math.round(temp * 10) / 10);

      // Humidity inverted to temperature
      const humidity = Math.min(95, Math.max(30, Math.round(65 - hourFactor * 25)));
      hourlyHumidity.push(humidity);

      hourlyPrecipProb.push(dailyPrecipProb[d]);
      hourlyWeatherCode.push(dailyWeatherCode[d]);

      const wind = isFahrenheit ? 8 + Math.abs(Math.sin(h)) * 6 : 12 + Math.abs(Math.sin(h)) * 10;
      hourlyWindSpeed.push(Math.round(wind * 10) / 10);

      const isDay = h >= 6 && h <= 19;
      const uv = isDay ? Math.max(0, Math.sin(((h - 6) * Math.PI) / 13) * dailyUvMax[d]) : 0;
      hourlyUvIndex.push(Math.round(uv * 10) / 10);
    }
  }

  const currentHourIndex = new Date().getHours();
  const currentTemp = hourlyTemp[currentHourIndex] || dailyMax[0];
  const currentHumidity = hourlyHumidity[currentHourIndex] || 55;
  const currentWind = hourlyWindSpeed[currentHourIndex] || (isFahrenheit ? 9 : 14);

  return {
    latitude: lat,
    longitude: lon,
    timezone: 'UTC',
    timezone_abbreviation: 'UTC',
    elevation: Math.round(Math.abs(Math.sin(lat) * 200)),
    current: {
      time: new Date().toISOString().slice(0, 16),
      temperature_2m: currentTemp,
      relative_humidity_2m: currentHumidity,
      apparent_temperature: currentTemp - 1,
      is_day: currentHourIndex >= 6 && currentHourIndex <= 19 ? 1 : 0,
      precipitation: dailyPrecipSum[0],
      weather_code: dailyWeatherCode[0],
      wind_speed_10m: currentWind,
      surface_pressure: 1013,
      uv_index: hourlyUvIndex[currentHourIndex] || dailyUvMax[0],
    },
    daily: {
      time: dailyTime,
      weather_code: dailyWeatherCode,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      precipitation_sum: dailyPrecipSum,
      precipitation_probability_max: dailyPrecipProb,
      wind_speed_10m_max: dailyWindMax,
      uv_index_max: dailyUvMax,
    },
    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTemp,
      relative_humidity_2m: hourlyHumidity,
      precipitation_probability: hourlyPrecipProb,
      weather_code: hourlyWeatherCode,
      wind_speed_10m: hourlyWindSpeed,
      uv_index: hourlyUvIndex,
    },
    locationName,
    country,
    admin1,
    isRateLimited: true,
  };
}

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  locationName: string,
  country?: string,
  admin1?: string,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherData> {
  const cacheKey = `weather_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${unit}`;

  // Check localStorage cache first (valid for 30 minutes)
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cachedData = JSON.parse(cachedStr);
      if (Date.now() - cachedData.timestamp < 30 * 60 * 1000) {
        return cachedData.data;
      }
    }
  } catch (e) {
    // Ignore cache parse errors
  }

  const tempUnitParam = unit === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
  const windUnitParam = unit === 'fahrenheit' ? '&wind_speed_unit=mph' : '';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&timezone=auto${tempUnitParam}${windUnitParam}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Open-Meteo API response not ok (${response.status}): ${errorText}`);

      // If rate limited (429) or server error, check if we have ANY existing cache, even expired
      try {
        const staleCache = localStorage.getItem(cacheKey);
        if (staleCache) {
          const parsed = JSON.parse(staleCache);
          return { ...parsed.data, isRateLimited: true };
        }
      } catch (err) {
        // ignore
      }

      // Return synthetic realistic model so the app NEVER crashes
      return generateFallbackWeatherData(lat, lon, locationName, country, admin1, unit);
    }

    const data = await response.json();

    // Compute current uv_index if not present in Open-Meteo current response object
    let currentUvIndex = data.current?.uv_index;
    if (currentUvIndex === undefined) {
      if (data.hourly?.uv_index && data.current?.time && data.hourly?.time) {
        const currentHourStr = data.current.time.slice(0, 13);
        const hourIdx = data.hourly.time.findIndex((t: string) => t.startsWith(currentHourStr));
        if (hourIdx !== -1) {
          currentUvIndex = data.hourly.uv_index[hourIdx];
        }
      }
      if (currentUvIndex === undefined && data.daily?.uv_index_max?.[0] !== undefined) {
        currentUvIndex = data.daily.uv_index_max[0];
      }
    }

    const currentObj: CurrentWeather = {
      ...data.current,
      uv_index: currentUvIndex ?? 0,
    };

    const result: WeatherData = {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      timezone_abbreviation: data.timezone_abbreviation,
      elevation: data.elevation,
      current: currentObj,
      daily: data.daily,
      hourly: data.hourly,
      locationName,
      country,
      admin1,
      isRateLimited: false,
    };

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result }));
    } catch (e) {
      // ignore quota exceeded
    }

    return result;
  } catch (err) {
    console.warn('Network error or rate limit when fetching Open-Meteo forecast. Using fallback model:', err);
    return generateFallbackWeatherData(lat, lon, locationName, country, admin1, unit);
  }
}

export function formatDayName(dateStr: string, index: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatShortDay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}
