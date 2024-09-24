import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Import to use getRepositoryToken
import { Flight } from './entities/flight.entity'; // Import your Flight entity

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    // Create a mock for the FlightRepository
    const mockFlightRepository = {
      find: jest.fn(), // Mock methods that you expect to use
      findOne: jest.fn(),
      // add other repository methods you need to mock
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: getRepositoryToken(Flight), // Use getRepositoryToken for the Flight entity
          useValue: mockFlightRepository, // Use the mock repository
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
