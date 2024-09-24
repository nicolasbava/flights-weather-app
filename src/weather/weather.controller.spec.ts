import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { FlightsService } from '../flights/flights.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('WeatherController', () => {
  let controller: WeatherController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let flightsService: FlightsService;

  beforeEach(async () => {
    const mockFlightsService = {
      findAll: jest.fn(),
      findOneByFlight: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [WeatherController],
      providers: [
        WeatherService,
        { provide: FlightsService, useValue: mockFlightsService },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    flightsService = module.get<FlightsService>(FlightsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
