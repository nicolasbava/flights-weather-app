import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
// import { FlightsService } from '../flights/flights.service';
import { FlightsModule } from 'src/flights/flights.module';
import { CacheOwnModule } from 'src/cache/cache.module';

@Module({
  imports: [FlightsModule, CacheOwnModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
