import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/entities/user.entity';
import { WeatherModule } from './weather/weather.module';
import { FlightsModule } from './flights/flights.module';
import { Flight } from './flights/entities/flight.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

const CacheConfig = {
  MAX_ITEMS: 5,
  LIFETIME_SECONDS: 30,
};

const ThrottlingConfig = {
  MAX_REQUESTS_PER_MINUTE: 200,
  TIME_WINDOW_MS: 1000,
};

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: ThrottlingConfig.TIME_WINDOW_MS / 1000,
        limit: ThrottlingConfig.MAX_REQUESTS_PER_MINUTE,
      },
    ]),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: CacheConfig.LIFETIME_SECONDS,
      max: CacheConfig.MAX_ITEMS,
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
      entities: [Flight],
      synchronize: true,
    }),
    WeatherModule,
    FlightsModule,
    AppModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
