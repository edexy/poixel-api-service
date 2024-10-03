import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Observable, map } from 'rxjs';
import {
  RESPONSE_SERIALIZER_KEY,
  RESPONSE_SERIALIZER_OPTIONS_KEY,
} from './response.constant';
import { HttpResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<Promise<T>> {
  constructor(private readonly reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<HttpResponse | any>>> {
    return next.handle().pipe(
      map(async (response: Promise<Record<string, any>>) => {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();

        res.setHeader('authorization', req.headers['authorization'] ?? '');

        const responseCustomSerializer: ClassConstructor<any> =
          this.reflector.get<ClassConstructor<any>>(
            RESPONSE_SERIALIZER_KEY,
            context.getHandler(),
          );

        const responseCustomSerializerOptions: ClassTransformOptions =
          this.reflector.get<ClassTransformOptions>(
            RESPONSE_SERIALIZER_OPTIONS_KEY,
            context.getHandler(),
          );

        const httpResponse = (await response) as HttpResponse;
        let data: Record<string, any> = {};
        let token: string;

        if (httpResponse) {
          data = httpResponse.data;

          res.statusCode = httpResponse._metadata?.httpStatus ?? res.statusCode;

          if (httpResponse?.data && responseCustomSerializer) {
            data = plainToInstance(
              responseCustomSerializer,
              httpResponse.data,
              responseCustomSerializerOptions,
            );
          }

          if (httpResponse._metadata?.accessToken) {
            res.setHeader('authorization', httpResponse._metadata.accessToken);
          }
        }

        if (httpResponse?.token) {
          token = httpResponse.token;
        }

        return {
          statusCode: httpResponse._metadata?.statusCode ?? res.statusCode,
          message: httpResponse?._metadata?.message,
          data,
          pagination: httpResponse?._metadata?.pagination,
          accessToken: token,
        };
      }),
    );
  }
}
