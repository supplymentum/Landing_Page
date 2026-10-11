import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas del backend comenzarán con /api
  app.setGlobalPrefix('api');

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Permite leer cookies como admin_token
  app.use(cookieParser());

  // Permite solicitudes desde el frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('SupplyMentum CMS API')
    .setDescription(
      'API for landing page content, applications, and admin access.',
    )
    .setVersion('1.0')
    .addCookieAuth('admin_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;

  await app.listen(port);

  console.log(`API running on http://localhost:${port}/api`);

  console.log(`Swagger available on http://localhost:${port}/docs`);
}

void bootstrap();
