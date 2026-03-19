import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/public/',
  });
  app.setGlobalPrefix('api');
  const logger = new Logger();
  logger.log(`SERVER RUNNING ON PORT ${process.env.PORT ?? 3000}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
