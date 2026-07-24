export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Region
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: CityLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  surface_pressure: number;
  uv_index: number;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecastData;
  locationName: string;
  country?: string;
  admin1?: string;
}

export interface WeatherCodeInfo {
  code: number;
  label: string;
  iconName: string; // Lucide icon name or indicator
  emoji: string;
  bgGradient: string;
}
