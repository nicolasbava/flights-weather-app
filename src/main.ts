import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger.service';
// import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  loggerService.logMessageTimes('Boca campeón!', 7);

  await app.listen(3000);
}
bootstrap();
