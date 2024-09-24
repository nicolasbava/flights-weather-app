import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
// import { FlightsService } from '../flights/flights.service';
import { FlightsModule } from 'src/flights/flights.module';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
  imports: [FlightsModule],
  exports: [WeatherService],
})
export class WeatherModule {}
