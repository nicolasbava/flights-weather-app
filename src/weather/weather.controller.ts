import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache-key')
  @CacheTTL(3000)
  @Get()
  findAll() {
    return this.weatherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherService.findOne(+id);
  }

  @Get('/flight/:id')
  findWeatherByIdFlight(@Param('id') idFlight: string) {
    return this.weatherService.findWeatherByIdFlight(idFlight);
  }
}
