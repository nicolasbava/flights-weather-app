import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { CacheOwnService } from '../cache/cache.service';
import { CacheOwnModule } from '../cache/cache.module';
import { WeatherService } from '../weather/weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flight]), CacheOwnModule],
  controllers: [FlightsController],
  providers: [FlightsService, CacheOwnService, WeatherService],
  exports: [FlightsService],
})
export class FlightsModule {}
