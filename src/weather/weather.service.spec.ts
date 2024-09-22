import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { FlightsService } from '../flights/flights.service'; // Make sure the path is correct
// import { InternalServerErrorException } from '@nestjs/common';

jest.mock('node-fetch'); // If you are using 'node-fetch' for the weather API call.
// import fetch from 'node-fetch';
// const { Response } = jest.requireActual('node-fetch');
const getWeatherByLatLong = jest.fn();

describe('WeatherService', () => {
  let service: WeatherService;
  let flightsService: FlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: FlightsService, // Mock the FlightsService here
          useValue: {
            findAll: jest.fn(), // Mock the methods you'll use
          },
        },
        {
          provide: 'getWeatherByLatLong', // Assuming this is a provider in your module
          useValue: getWeatherByLatLong,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    flightsService = module.get<FlightsService>(FlightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('findAll', () => {
  //   it('should return flights with weather information for origin and destination', async () => {
  //     // Mock flight data
  //     const mockFlights = [
  //       {
  //         id: 1,
  //         originIataCode: 'TLC',
  //         originName: 'Licenciado Adolfo Lopez Mateos International Airport',
  //         originLatitude: '19.3371000',
  //         originLongitude: '-99.5660000',
  //         destinationIataCode: 'MTY',
  //         destinationName: 'General Mariano Escobedo International Airport',
  //         destinationLatitude: '25.7785000',
  //         destinationLongitude: '-100.1070000',
  //       },
  //     ];

  //     // Mock the weather data returned from the API
  //     const mockWeatherResponse = {
  //       elevation: 2580,
  //       current_weather: {
  //         temperature: 20.7,
  //         windspeed: 6.2,
  //         winddirection: 83,
  //         is_day: 1,
  //         weathercode: 2,
  //       },
  //       current_weather_units: {
  //         temperature: '°C',
  //         windspeed: 'km/h',
  //         winddirection: '°',
  //         weathercode: 'wmo code',
  //       },
  //     };

  //     // Mock the FlightsService to return our mock flight data
  //     (flightsService.findAll as jest.Mock).mockResolvedValue(mockFlights);

  //     // Mock the weather API response
  //     (fetch as jest.Mock).mockResolvedValue(
  //       new Response(JSON.stringify(mockWeatherResponse)),
  //     );

  //     // Call the service method
  //     const result = await service.findAll();

  //     // Validate the result structure
  //     expect(result).toHaveLength(1); // Ensure one flight is returned
  //     expect(result[0].originWeather).toContain({
  //       elevation: '2580m',
  //       temperature: '20.7°C',
  //       windSpeed: '6.2km/h',
  //       windDirection: '83°',
  //       weatherCode: '2 wmo code',
  //       isDay: true,
  //     });
  //     expect(result[0].destinationWeather).toContain({
  //       elevation: '2580m',
  //       temperature: '20.7°C',
  //       windSpeed: '6.2km/h',
  //       windDirection: '83°',
  //       weatherCode: '2 wmo code',
  //       isDay: true,
  //     });

  //     expect(flightsService.findAll).toHaveBeenCalledTimes(1);
  //     expect(fetch).toHaveBeenCalledTimes(2); // One for origin, one for destination
  //   });

  //   it('should throw an error if the weather data fails', async () => {
  //     // Mock flight data
  //     const mockFlights = [
  //       {
  //         id: 1,
  //         originIataCode: 'TLC',
  //         originLatitude: '19.3371000',
  //         originLongitude: '-99.5660000',
  //         destinationIataCode: 'MTY',
  //         destinationLatitude: '25.7785000',
  //         destinationLongitude: '-100.1070000',
  //       },
  //     ];

  //     // Mock the FlightsService to return our mock flight data
  //     (flightsService.findAll as jest.Mock).mockResolvedValue(mockFlights);

  //     // Mock the weather API to throw an error
  //     (fetch as jest.Mock).mockResolvedValue(
  //       new Response(null, { status: 500 }),
  //     );

  //     // Call the service method and expect an error to be thrown
  //     await expect(service.findAll()).rejects.toThrow(
  //       'Failed to fetch weather data',
  //     );
  //   });
  // });
  describe('YourService - Large Dataset', () => {
    let service: WeatherService;
    let flightsService: FlightsService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          WeatherService,
          {
            provide: FlightsService,
            useValue: {
              findAll: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<WeatherService>(WeatherService);
      flightsService = module.get<FlightsService>(FlightsService);
    });

    it('should correctly combine weather and flight data for a large dataset', async () => {
      const flightsMock = new Array(3000).fill(null).map((_, i) => ({
        id: i + 1,
        originIataCode: 'TLC',
        originName: 'Licenciado Adolfo Lopez Mateos International Airport',
        originLatitude: '19.3371000',
        originLongitude: '-99.5660000',
        destinationIataCode: 'MTY',
        destinationName: 'General Mariano Escobedo International Airport',
        destinationLatitude: '25.7785000',
        destinationLongitude: '-100.1070000',
      }));

      const weatherMock = {
        elevation: 2580,
        current_weather: {
          temperature: 20.7,
          windspeed: 6.2,
          winddirection: 83,
          weathercode: 2,
        },
        current_weather_units: {
          temperature: '°C',
          windspeed: 'km/h',
          winddirection: '°',
          weathercode: 'wmo code',
        },
      };

      flightsService.findAll();
      (getWeatherByLatLong as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(weatherMock),
      });

      const result = await service.findAll();

      // 1. Check the total length of the result array
      expect(result.length).toBeCloseTo(3000);

      // 2. Check that a few randomly selected flights have the required properties
      const sampleFlights = result.slice(0, 10); // Take first 10 items as a sample
      sampleFlights.forEach((flight) => {
        expect(flight).toHaveProperty('id');
        expect(flight).toHaveProperty('originIataCode', 'TLC');
        expect(flight).toHaveProperty('destinationIataCode', 'MTY');
        expect(flight.originWeather).toHaveProperty('elevation');
        expect(flight.originWeather).toHaveProperty('temperature');
        expect(flight.destinationWeather).toHaveProperty('elevation');
      });

      // 3. Test edge case - Make sure that every flight has both originWeather and destinationWeather
      result.forEach((flight) => {
        expect(flight.originWeather).toBeTruthy();
        expect(flight.destinationWeather).toBeTruthy();
      });

      // 4. You can also randomly test a few specific items in the middle of the array
      const randomIndex = Math.floor(Math.random() * result.length);
      const randomFlight = result[randomIndex];
      expect(randomFlight.originWeather).toHaveProperty('temperature');
      expect(randomFlight.destinationWeather).toHaveProperty('windSpeed');
    });
  });
});
