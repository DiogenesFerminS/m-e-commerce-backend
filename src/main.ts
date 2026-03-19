import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  const logger = new Logger();
  logger.log(`SERVER RUNNING ON PORT ${process.env.PORT ?? 3000}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
