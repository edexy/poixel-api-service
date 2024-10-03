import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import typeormConfig from '../database/typeorm';
import appConfig from './configs/app.config';
import { validateEnv as validate } from './configs/validation';
import { ErrorModule } from './error/error.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    ErrorModule,
    RequestModule,
    ResponseModule,
    ConfigModule.forRoot({
      load: [appConfig, typeormConfig],
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validate,
    }),
  ],
})
export class CommonModule {}
