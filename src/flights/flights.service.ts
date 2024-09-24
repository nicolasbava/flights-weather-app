import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { Airport } from './flights.interfaces';

@Injectable()
export class FlightsService {
  private readonly CACHE_KEY = 'flightsWeathers';

  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  findAll() {
    return this.flightRepository.find();
  }

  findOne(id: number) {
    return this.flightRepository.findOneBy({ id });
  }

  findOneByFlightNum(flightNum: string) {
    return this.flightRepository.findOneBy({ flightNum });
  }

  public extractAirportsFromFlights(allFlights: Array<Flight>) {
    const airportSet: Set<string> = new Set();
    const nonRepeatedAirports: Array<Airport> = [];
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
    const mapFlightsArrayAndAddAirport = () => {
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
    mapFlightsArrayAndAddAirport();
    return nonRepeatedAirports;
  }
}
