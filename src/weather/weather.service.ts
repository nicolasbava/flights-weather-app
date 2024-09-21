import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FlightsService } from '../flights/flights.service';

interface Airport {
  iataCode: string;
  name: string;
  latitude: string;
  longitude: string;
}

const getWeatherByLatLong = async (latitude: string, longitude: string) => {
  const weather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
  );

  return weather;
};

@Injectable()
export class WeatherService {
  constructor(private readonly flightsService: FlightsService) {}

  async findAll() {
    const flights = await this.flightsService.findAll();

    const airportSet = new Set();
    const addAirport = (iataCode, name, latitude, longitude) => {
      const airportKey = `${iataCode}`; // Usar el iataCode como clave única
      if (!airportSet.has(airportKey)) {
        airportSet.add(airportKey); // Añadir clave única
        nonRepeatedAirports.push({
          iataCode,
          name,
          latitude,
          longitude,
        });
      }
    };

    const nonRepeatedAirports = [];

    flights.map((flight) => {
      // Add response from origin
      addAirport(
        flight.originIataCode,
        flight.originName,
        flight.originLatitude,
        flight.originLongitude,
      );

      // Add response from destination
      addAirport(
        flight.destinationIataCode,
        flight.destinationName,
        flight.destinationLatitude,
        flight.destinationLongitude,
      );
    });

    const airportsWithWeather = await Promise.all(
      nonRepeatedAirports.map(async (airport) => {
        const weatherResponse = await getWeatherByLatLong(
          airport.latitude,
          airport.longitude,
        );

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weather = await weatherResponse.json();

        const weatherTransformed = {
          elevation: `${weather.elevation}m`,
          temperature: `${weather.current_weather.temperature}${weather.current_weather_units.temperature}`,
          windSpeed: `${weather.current_weather.windspeed}${weather.current_weather_units.windspeed}`,
          windDirection: `${weather.current_weather.winddirection}${weather.current_weather_units.winddirection}`,
          weatherCode: `${weather.current_weather.weathercode} ${weather.current_weather_units.weathercode}`,
          isDay: 1 ? true : false,
        };

        return {
          ...airport,
          weatherTransformed,
        };
      }),
    );

    return airportsWithWeather;
  }

  findOne(id: number) {
    return `This action returns weather data for ID #${id}`;
  }

  async findWeatherByIdFlight(idFlight: string) {
    try {
      // Get flight details
      const flight = await this.flightsService.findOneByFlight(idFlight);

      if (!flight) {
        throw new InternalServerErrorException(
          `Flight with ID ${idFlight} not found`,
        );
      }

      const originData = {
        latitude: flight.originLatitude,
        longitude: flight.originLongitude,
      };

      const destinationData = {
        latitude: flight.destinationLatitude,
        longitude: flight.destinationLongitude,
      };

      // Fetch weather data from the external API
      const responseO = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${originData.latitude}&longitude=${originData.longitude}&current_weather=true`,
      );

      const responseD = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${destinationData.latitude}&longitude=${destinationData.longitude}&current_weather=true`,
      );

      if (!responseO.ok || !responseD.ok) {
        throw new Error('Failed to fetch weather data');
      }

      // Parse the weather data
      const weatherData = await responseO.json();
      const destWeatherData = await responseD.json();

      // Log the result for debugging (optional)
      // console.log('weatherOrigin ->', weatherData);

      // Return the weather data
      // return {
      //   flightId: idFlight,
      //   origin: flight.origin,
      //   destination: flight.destination,
      //   originWeather: weatherData.current_weather,
      //   destinationWeather: destWeatherData.current_weather,
      // };

      return destWeatherData;
    } catch (error) {
      // Handle any errors that occur during the API call or flight lookup
      console.error('Error fetching weather data:', error);
      throw new InternalServerErrorException('Failed to retrieve weather data');
    }
  }
}
