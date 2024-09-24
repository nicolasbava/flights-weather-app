import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  findAll() {
    return this.weatherService.getOrFetchWeathersFlight();
  }

  @Get('/flight/:id')
  findWeatherByIdFlight(@Param('id') idFlight: string) {
    return this.weatherService.findWeatherByIdFlight(idFlight);
  }
}
