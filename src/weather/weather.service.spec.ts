import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { FlightsService } from '../flights/flights.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { Weather } from './weather.interfaces';
import { CacheOwnModule } from '../cache/cache.module';

// Mock fetch globally
global.fetch = jest.fn();
describe('WeatherService', () => {
  let weatherService: WeatherService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let flightsService: FlightsService;

  const mockFlightsService = {
    findAll: jest.fn(),
    extractAirportsFromFlights: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: FlightsService,
          useValue: mockFlightsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
      imports: [CacheOwnModule],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
    flightsService = module.get<FlightsService>(FlightsService);
  });

  describe('fetchFlightsWeatherData', () => {
    it('should return flights with correct keys', async () => {
      const mockFlights = [
        {
          id: 1,
          originIataCode: 'TLC',
          destinationIataCode: 'MTY',
          // Add any other necessary flight properties here
        },
      ];

      const mockAirports = [
        {
          iataCode: 'TLC',
          latitude: '19.3371',
          longitude: '-99.566',
          // Add any other necessary airport properties here
        },
      ];

      const mockCombinedResponse = [
        {
          ...mockFlights[0],
          originWeather: { elevation: '2580m' },
          destinationWeather: { elevation: '383m' },
        },
      ];

      mockFlightsService.findAll.mockResolvedValue(mockFlights);
      mockFlightsService.extractAirportsFromFlights.mockReturnValue(
        mockAirports,
      );
      weatherService.addWeatherToAirports = jest.fn().mockResolvedValue([
        {
          iataCode: 'TLC',
          weatherTransformed: { elevation: '2580m' },
        },
      ]);
      weatherService.combineFlightsWithWeather = jest
        .fn()
        .mockReturnValue(mockCombinedResponse);

      const result = await weatherService.fetchFlightsWeatherData();

      expect(result).toHaveLength(mockCombinedResponse.length);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('originIataCode');
      expect(result[0]).toHaveProperty('destinationIataCode');
      expect(result[0]).toHaveProperty('originWeather');
      expect(result[0]).toHaveProperty('destinationWeather');
      // Add any other expected properties here
    });
  });

  describe('getWeatherByLatLong', () => {
    it('should return weather data with specific keys for given latitude and longitude', async () => {
      const latitude = '19.3371';
      const longitude = '-99.566';

      const mockWeatherResponse = {
        elevation: 2580,
        current_weather: {
          temperature: 15.6,
          windspeed: 4.4,
        },
        current_weather_units: {
          temperature: '°C',
          windspeed: 'km/h',
        },
      };
      // Correctly mock the fetch response
      (fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockWeatherResponse),
      });
      const result = await weatherService.getWeatherByLatLong(
        latitude,
        longitude,
      );
      // Check for the existence of specific keys
      expect(result).toHaveProperty('elevation');
      expect(result).toHaveProperty('current_weather');
      expect(result.current_weather).toHaveProperty('temperature');
      expect(result).toHaveProperty('current_weather_units');
      // Optional: Check that the keys are defined
      expect(result.elevation).toBeDefined();
      expect(result.current_weather).toBeDefined();
      expect(result.current_weather.temperature).toBeDefined();
      expect(result.current_weather_units).toBeDefined();
    });

    it('should handle fetch errors', async () => {
      const latitude = '19.3371';
      const longitude = '-99.566';
      // Correctly mock a fetch error
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));
      await expect(
        weatherService.getWeatherByLatLong(latitude, longitude),
      ).rejects.toThrow('Fetch error');
    });
  });

  describe('transformWeatherData', () => {
    it('should transform weather data correctly', () => {
      const mockWeather: Weather = {
        elevation: 2580,
        latitude: 19.3371,
        longitude: -99.566,
        utc_offset_seconds: 0,
        timezone: 'GMT',
        timezone_abbreviation: 'GMT',
        generationtime_ms: 0.049948692321777344,
        current_weather: {
          temperature: 15.6,
          windspeed: 4.4,
          winddirection: 35,
          weathercode: 3,
          is_day: 1,
        },
        current_weather_units: {
          temperature: '°C',
          windspeed: 'km/h',
          winddirection: '°',
          weathercode: 'WMO code',
          is_day: '',
        },
      };
      const transformedData = weatherService.transformWeatherData(mockWeather);
      // Check for existence and correctness of keys
      expect(transformedData).toHaveProperty('elevation');
      expect(transformedData).toHaveProperty('temperature');
      expect(transformedData).toHaveProperty('windSpeed');
      expect(transformedData).toHaveProperty('windDirection');
      expect(transformedData).toHaveProperty('weatherCode');
      expect(transformedData).toHaveProperty('isDay');
      // Validate the transformed values
      expect(transformedData.elevation).toBe('2580m');
      expect(transformedData.temperature).toBe('15.6°C');
      expect(transformedData.windSpeed).toBe('4.4km/h');
      expect(transformedData.windDirection).toBe('35°');
      expect(transformedData.weatherCode).toBe('3 WMO code');
      expect(transformedData.isDay).toBe(true);
    });
  });
});
