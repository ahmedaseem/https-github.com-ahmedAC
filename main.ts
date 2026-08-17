import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 5050;

  await app.listen(port, '0.0.0.0');

  console.log(
    `ASEM API running on http://0.0.0.0:${port}`
  );
}

bootstrap();
