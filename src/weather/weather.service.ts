import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FlightsService } from '../flights/flights.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Flight } from 'src/flights/entities/flight.entity';
import { Cache } from 'cache-manager';

interface Airport {
  iataCode: string;
  name: string;
  latitude: string;
  longitude: string;
}

type CurrentWeatherUnits = {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
};

type CurrentWeather = {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: 1 | 0;
  weathercode: number;
};

interface Weather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: string;
  timezone: number;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: CurrentWeatherUnits;
  current_weather: CurrentWeather;
}

const getWeatherByLatLong = async (latitude: string, longitude: string) => {
  const weather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
  );
  return weather;
};

@Injectable()
export class WeatherService {
  constructor(
    private readonly flightsService: FlightsService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findAll() {
    // Check cache for existing data
    const cachedData = await this.cacheService.get('flightsWeathers');

    if (cachedData) return cachedData;

    // If no cached data, proceed to fetch flights and weather
    const airportSet: Set<string> = new Set();
    const nonRepeatedAirports: Array<Airport> = [];
    const allFlights = await this.flightsService.findAll();

    const addAirport = (
      iataCode: string,
      name: string,
      latitude: string,
      longitude: string,
    ) => {
      const airportKey = `${iataCode}`;
      if (!airportSet.has(airportKey)) {
        airportSet.add(airportKey);
        nonRepeatedAirports.push({
          iataCode,
          name,
          latitude,
          longitude,
        });
      }
    };

    const findWeatherByIataCode = (iataCode: string) => {
      return addWeatherToAirports.find(
        (airport) => airport.iataCode === iataCode,
      );
    };

    const transformWeatherData = (weather: Weather) => {
      return {
        elevation: `${weather.elevation}m`,
        temperature: `${weather.current_weather.temperature}${weather.current_weather_units.temperature}`,
        windSpeed: `${weather.current_weather.windspeed}${weather.current_weather_units.windspeed}`,
        windDirection: `${weather.current_weather.winddirection}${weather.current_weather_units.winddirection}`,
        weatherCode: `${weather.current_weather.weathercode} ${weather.current_weather_units.weathercode}`,
        isDay: 1 ? true : false,
      };
    };

    const addAirportsToSet = () => {
      allFlights.map((flight) => {
        // Add response from origin
        addAirport(
          flight.originIataCode,
          flight.originName,
          String(flight.originLatitude),
          String(flight.originLongitude),
        );

        // Add response from destination
        addAirport(
          flight.destinationIataCode,
          flight.destinationName,
          String(flight.destinationLatitude),
          String(flight.destinationLongitude),
        );
      });
    };

    addAirportsToSet();

    // const getWeathersOfAirports = () => {};

    const addWeatherToAirports = await Promise.all(
      nonRepeatedAirports.map(async (airport) => {
        try {
          const allWeathersResponse = await getWeatherByLatLong(
            airport.latitude,
            airport.longitude,
          );
          const weather = await allWeathersResponse.json();
          const weatherTransformed = transformWeatherData(weather);

          return {
            ...airport,
            weatherTransformed,
          };
        } catch (err) {
          console.error('Error:', err);
          throw new Error(`Failed to fetch weather data`);
        }
      }),
    );

    // Combine information
    const flightWeathersCombined = allFlights.map((flight) => {
      const originWeather = findWeatherByIataCode(flight.originIataCode);
      const destinationWeather = findWeatherByIataCode(
        flight.destinationIataCode,
      );

      return {
        ...flight,
        originWeather: originWeather ? originWeather.weatherTransformed : null,
        destinationWeather: destinationWeather
          ? destinationWeather.weatherTransformed
          : null,
      };
    });

    await this.cacheService.set('flightsWeathers', flightWeathersCombined[0]);
    const data = await this.cacheService.get('flightsWeathers');
    console.log('==== DATA BEIGN CALLED ====');
    console.log('data set to cache', data);
    console.log('==== END FUNCTION ====');

    return flightWeathersCombined;
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
      // const weatherData = await responseO.json();
      const destWeatherData = await responseD.json();

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
