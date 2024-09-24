import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/entities/user.entity';
import { WeatherModule } from './weather/weather.module';
import { FlightsModule } from './flights/flights.module';
import { Flight } from './flights/entities/flight.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600000, // Cache expiration time in milliseconds
      max: 5, // Maximum number of items in cache
      store: redisStore,
      host: 'localhost',
      port: process.env.REDIS_PORT,
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
    WeatherModule,
    FlightsModule,
    AppModule,
  ],
})
export class AppModule {}
