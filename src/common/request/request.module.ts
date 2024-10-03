import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { RequestMiddlewareModule } from './middlewares/request.middleware.module';

@Module({
  imports: [RequestMiddlewareModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          skipMissingProperties: false,
          forbidUnknownValues: false,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    },
  ],
})
export class RequestModule {}
