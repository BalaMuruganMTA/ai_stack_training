import { CityLocation, GeocodingResponse, WeatherCodeInfo, WeatherData } from '../types/weather';

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

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search locations');
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  locationName: string,
  country?: string,
  admin1?: string,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherData> {
  const tempUnitParam = unit === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '&temperature_unit=celsius';
  const windUnitParam = unit === 'fahrenheit' ? '&wind_speed_unit=mph' : '&wind_speed_unit=kmh';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=auto${tempUnitParam}${windUnitParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather forecast');
  }

  const data = await response.json();

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezone_abbreviation: data.timezone_abbreviation,
    elevation: data.elevation,
    current: data.current,
    daily: data.daily,
    hourly: data.hourly,
    locationName,
    country,
    admin1,
  };
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
