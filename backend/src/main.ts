import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as typeof import('cookie-parser');

import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // The backend runs behind exactly one reverse proxy (nginx). Trusting one hop
  // makes `req.ip` the real client address (taken from X-Forwarded-For), which
  // the login throttle and analytics rely on.
  app.set('trust proxy', 1);

  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ limit: '15mb', extended: true }));

  // Enable cookie parsing so AuthGuard can read HttpOnly session cookie
  app.use(cookieParser());

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3001);
  const frontendUrl = config.get<string>(
    'FRONTEND_URL',
    'http://localhost:3000',
  );
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  app.enableCors({
    // Production only accepts the configured frontend origin; the local dev
    // servers are allowed outside production.
    origin: isProduction
      ? [frontendUrl]
      : [frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true, // Required to send/receive cookies cross-origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  });

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
