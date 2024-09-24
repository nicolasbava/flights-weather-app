import { WeatherParsed } from 'src/weather/weather.interfaces';

export interface Flight {
  id: number;
  origin: string;
  destination: string;
  airline: string;
  flightNum: string;
  originIataCode: string;
  originName: string;
  originLatitude: number;
  originLongitude: number;
  destinationIataCode: string;
  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
}

export interface Airport {
  iataCode: string;
  name: string;
  latitude: string;
  longitude: string;
}

export interface FlightWithWeather extends Flight {
  originWeather: WeatherParsed;
  destinationWeather: WeatherParsed;
}

export interface FlightWithWeatherResponse {
  origin: string;
  data: FlightWithWeather[];
}
