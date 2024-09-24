/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { WeatherService } from '../weather/weather.service';
import { CacheOwnService } from '../cache/cache.service';
import { FlightWithWeatherResponse } from './flights.interfaces';

describe('FlightsController', () => {
  let flightsController: FlightsController;
  let flightsService: FlightsService;
  let weatherService: WeatherService;
  let cacheOwnService: CacheOwnService;

  const mockFlightsService = {
    findAll: jest.fn(),
    extractAirportsFromFlights: jest.fn(),
  };

  const mockWeatherService = {
    addWeatherToAirports: jest.fn(),
    combineFlightsWithWeather: jest.fn(),
  };

  const mockCacheOwnService = {
    getOrFetch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: FlightsService,
          useValue: mockFlightsService,
        },
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
        {
          provide: CacheOwnService,
          useValue: mockCacheOwnService,
        },
      ],
    }).compile();

    flightsController = module.get<FlightsController>(FlightsController);
    flightsService = module.get<FlightsService>(FlightsService);
    weatherService = module.get<WeatherService>(WeatherService);
    cacheOwnService = module.get<CacheOwnService>(CacheOwnService);
  });

  describe('findAllFlightsWeather', () => {
    it('should return flights weather data', async () => {
      const mockResponse: FlightWithWeatherResponse = {
        origin: 'cache',
        data: [
          {
            id: 1,
            origin: 'TLC',
            destination: 'MTY',
            airline: '4O',
            flightNum: '104',
            originIataCode: 'TLC',
            originName: 'Licenciado Adolfo Lopez Mateos International Airport',
            originLatitude: 19.3371,
            originLongitude: -99.566,
            destinationIataCode: 'MTY',
            destinationName: 'General Mariano Escobedo International Airport',
            destinationLatitude: 25.7785,
            destinationLongitude: -100.107,
            originWeather: {
              elevation: '2580m',
              temperature: '15.6°C',
              windSpeed: '4.4km/h',
              windDirection: '35°',
              weatherCode: '3 wmo code',
              isDay: false,
            },
            destinationWeather: {
              elevation: '383m',
              temperature: '28.5°C',
              windSpeed: '6.2km/h',
              windDirection: '126°',
              weatherCode: '0 wmo code',
              isDay: false,
            },
          },
        ],
      };

      mockCacheOwnService.getOrFetch.mockResolvedValue(mockResponse);
      const result = await flightsController.findAllFlightsWeather();
      expect(result).toEqual(mockResponse);
      expect(mockCacheOwnService.getOrFetch).toHaveBeenCalled();
    });
  });
});
