import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  logMessageTimes(message: string, times: number): void {
    for (let i = 0; i < times; i++) {
      console.log(message);
    }
  }
}
