import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/payment/webhook',
    bodyParser.raw({ type: 'application/json' }), // Stripe requires raw body
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
