import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(
    '/payment/webhook',
    bodyParser.raw({ type: 'application/json' }), // Stripe requires raw body
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
