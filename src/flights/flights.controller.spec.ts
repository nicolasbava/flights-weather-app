/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { WeatherService } from '../weather/weather.service';
import { CacheOwnService } from '../cache/cache.service';

describe('FlightsController', () => {
  let flightsController: FlightsController;

  const mockFlightsService = {
    findAll: jest.fn(),
    extractAirportsFromFlights: jest.fn(),
    findOne: jest.fn((id: number) => {
      if (id === null) {
        throw new Error('Flight ID cannot be null');
      }
      return { id, flightNum: '123' }; // Dummy flight object
    }),
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
  });

  describe('findOne', () => {
    it('should throw an error if null is passed', async () => {
      try {
        await flightsController.findOne(null);
      } catch (e) {
        expect(e.message).toBe('Flight ID cannot be null');
      }
    });

    it('should return a flight if a valid ID is passed', async () => {
      const result = await flightsController.findOne(1);
      expect(result).toEqual({ id: 1, flightNum: '123' });
    });
  });
});
