import { Controller, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { WeatherService } from '../weather/weather.service';
import { CacheOwnService } from '../cache/cache.service';
import { Flight, FlightWithWeather } from './flights.interfaces';

@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
    private readonly weatherService: WeatherService,
    private readonly cacheOwnService: CacheOwnService,
  ) {}

  private readonly WEATHER_CACHE_KEY = 'flightsWeathers';

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Flight> {
    return this.flightsService.findOne(+id);
  }

  @Get('/flight/:id')
  findOneByFlight(@Param('id') idFlight: string) {
    return this.flightsService.findOneByFlightNum(idFlight);
  }
}
