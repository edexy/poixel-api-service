import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './common/swagger';
import { SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(express.json({ limit: '10MB' }));

  app.setGlobalPrefix('v1/api');
  const document = useSwagger(app);
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('docs', app, document, swaggerOptions);
  await app.listen(3090);
  Logger.log(`App listening on PORT: 3090`)
}
bootstrap();
