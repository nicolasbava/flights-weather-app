import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class WeatherFetcher {
  abstract findWeather(latitude: string, longitude: string): any;
}
