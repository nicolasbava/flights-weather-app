import { Airport } from '../flights/flights.interfaces';

export type CurrentWeatherUnits = {
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
};

export type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: 1 | 0;
  weathercode: number;
};

export interface Weather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: CurrentWeatherUnits;
  current_weather: CurrentWeather;
}

export type WeatherParsed = {
  elevation: string;
  temperature: string;
  windSpeed: string;
  windDirection: string;
  weatherCode: string;
  isDay: boolean;
};

// export interface AirportWithWeather extends Airport {
//   originWeather: WeatherParsed;
//   destinationWeather: WeatherParsed;
// }

export interface AirportWithWeather extends Airport {
  weatherTransformed: WeatherParsed;
}
