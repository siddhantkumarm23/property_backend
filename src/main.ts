import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const APP_PORT = Number(configService.get('PORT')) || 3001;

  // Global API prefix
  const appPrefix = 'v1';
  app.setGlobalPrefix(appPrefix);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors();
  // Swagger Config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  // Create Swagger Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger UI
  SwaggerModule.setup(`${appPrefix}/api`, app, document);

  await app.listen(APP_PORT);

  console.log(`🚀 App started on http://localhost:${APP_PORT}/${appPrefix}`);
  console.log(`📘 Swagger: http://localhost:${APP_PORT}/${appPrefix}/api`);
}
bootstrap();
