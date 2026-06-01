import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3001);
  const frontendUrl = config.get<string>(
    'FRONTEND_URL',
    'http://localhost:3000',
  );
  console.log(`Frontend URL: ${frontendUrl}`);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  });

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
