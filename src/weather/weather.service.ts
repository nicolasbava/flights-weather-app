import {
  Airport,
  Flight,
  FlightWithWeather,
} from 'src/flights/flights.interfaces';
import { AirportWithWeather, Weather } from './weather.interfaces';
import { FlightsService } from '../flights/flights.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class WeatherService {
  constructor(
    private readonly flightsService: FlightsService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  public async fetchFlightsWeatherData(): Promise<FlightWithWeather[]> {
    const allFlights = await this.flightsService.findAll();
    const allAirportsNonRepeated =
      this.flightsService.extractAirportsFromFlights(allFlights);
    const combineAirportsWithWeather = await this.addWeatherToAirports(
      allAirportsNonRepeated,
    );
    return this.combineFlightsWithWeather(
      allFlights,
      combineAirportsWithWeather,
    );
  }

  public async getWeatherByLatLong(latitude: string, longitude: string) {
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
    );
    return weather.json();
  }

  public transformWeatherData(weather: Weather) {
    return {
      elevation: `${weather.elevation}m`,
      temperature: `${weather.current_weather.temperature}${weather.current_weather_units.temperature}`,
      windSpeed: `${weather.current_weather.windspeed}${weather.current_weather_units.windspeed}`,
      windDirection: `${weather.current_weather.winddirection}${weather.current_weather_units.winddirection}`,
      weatherCode: `${weather.current_weather.weathercode} ${weather.current_weather_units.weathercode}`,
      isDay: weather.current_weather.is_day === 1 ? true : false,
    };
  }

  public findAirportWeatherByIataCode(
    iataCode: string,
    airportsWithWeather: AirportWithWeather[],
  ): AirportWithWeather | undefined {
    return airportsWithWeather.find((airport) => airport.iataCode === iataCode);
  }

  public async addWeatherToAirports(
    nonRepeatedAirports: Array<Airport>,
  ): Promise<AirportWithWeather[]> {
    return await Promise.all(
      nonRepeatedAirports.map(async (airport) => {
        try {
          const weather = await this.getWeatherByLatLong(
            airport.latitude,
            airport.longitude,
          );
          const weatherTransformed = this.transformWeatherData(weather);
          return {
            ...airport,
            weatherTransformed,
          };
        } catch (err) {
          console.error('Error:', err);
          throw new Error('Failed to fetch weather data');
        }
      }),
    );
  }

  // Method to combine calculated airport weather with all flights data
  public combineFlightsWithWeather(
    flights: Flight[],
    airportsWithWeather: AirportWithWeather[],
  ) {
    return flights.map((flight) => {
      const originWeather = this.findAirportWeatherByIataCode(
        flight.originIataCode,
        airportsWithWeather,
      );
      const destinationWeather = this.findAirportWeatherByIataCode(
        flight.destinationIataCode,
        airportsWithWeather,
      );

      return {
        ...flight,
        originWeather: originWeather ? originWeather.weatherTransformed : null,
        destinationWeather: destinationWeather
          ? destinationWeather.weatherTransformed
          : null,
      };
    });
  }

  public async findAll() {
    const cachedData = await this.cacheService.get('flightsWeathers');
    if (cachedData) return cachedData;

    const allFlights = await this.flightsService.findAll();

    // Extraer aeropuertos únicos
    const allAirportsNonRepeated =
      this.flightsService.extractAirportsFromFlights(allFlights);

    // Obtener el clima de los aeropuertos
    const airportsWithWeather = await this.addWeatherToAirports(
      allAirportsNonRepeated,
    );

    // Combinar vuelos con la información del clima
    const combinedFlightsWithWeather = this.combineFlightsWithWeather(
      allFlights,
      airportsWithWeather,
    );

    // Almacenar en caché el resultado
    await this.cacheService.set('flightsWeathers', combinedFlightsWithWeather);

    return combinedFlightsWithWeather;
  }

  findOne(id: number) {
    return `This action returns weather data for ID #${id}`;
  }

  async findWeatherByIdFlight(idFlight: string) {
    try {
      const flight = await this.flightsService.findOneByFlightNum(idFlight);
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
      const originWeatherData = await responseO.json();
      const destWeatherData = await responseD.json();
      // Return the weather data
      return {
        flightId: idFlight,
        origin: flight.origin,
        destination: flight.destination,
        originWeather: this.transformWeatherData(originWeatherData),
        destinationWeather: this.transformWeatherData(destWeatherData),
      };
    } catch (error) {
      // Handle any errors that occur during the API call or flight lookup
      console.error('Error fetching weather data:', error);
      throw new InternalServerErrorException('Failed to retrieve weather data');
    }
  }
}
