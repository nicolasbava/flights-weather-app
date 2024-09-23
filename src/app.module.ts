import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
// import { User } from './user/entities/user.entity';
import { WeatherModule } from './weather/weather.module';
import { FlightsModule } from './flights/flights.module';
import { Flight } from './flights/entities/flight.entity';
import { LoggerService } from './logger.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 50000, // Cache expiration time in milliseconds
      max: 5, // Maximum number of items in cache
      store: redisStore,
      host: 'localhost',
      port: process.env.REDIS_PORT,
      // username: process.env.REDIS_USERNAME,
      // password: process.env.REDIS_PASSWORD,
      // no_ready_check: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'weather-flights-db',
      entities: [Flight], // Aquí va tu entidad
      synchronize: true, // true solo en desarrollo para auto sincronizar el esquema
    }),
    UserModule,
    WeatherModule,
    FlightsModule,
  ],
  providers: [LoggerService],
  // controllers:
})
export class AppModule {}
