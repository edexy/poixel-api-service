import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestJsonBodyParserMiddleware } from './request.body-parser.middleware';
import { RequestCookieParserMiddleware } from './request.cookie-parser.middleware';
import { RequestCorsMiddleware } from './request.cors.middleware';
import LogsMiddleware from './logs.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestJsonBodyParserMiddleware,
        RequestCookieParserMiddleware,
        RequestCorsMiddleware,
      )
      .forRoutes('*');
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
