import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { QueryFailedError } from 'typeorm';
import { ErrorException } from '../interfaces/error.interface';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    this.logger.log(exception, 'ErrorFilter');
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[];
    const validationErrors: string[] = [];

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      httpStatus = exception.getStatus();
      statusCode = exceptionResponse['statusCode'] ?? httpStatus;
      message = exceptionResponse.toString()
      if (this.isErrorException(exceptionResponse)) {
        if (exceptionResponse.errors?.length > 0) {
          const errors = exceptionResponse.errors.map((error) => {
            return Object.values(error.constraints)[0];
          });

          validationErrors.push(...errors);
        }
        message = exceptionResponse.message;

        if (Array.isArray(message) && exceptionResponse.message?.length > 0) {
          validationErrors.push(...exceptionResponse.message);
          message = undefined;
        }
      }
    }

    if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    if (!(exception instanceof HttpException) && exception instanceof Error) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    return response.status(httpStatus).json({
      statusCode,
      message,
      validationErrors,
    });
  }

  isErrorException(obj: any): obj is ErrorException {
    return typeof obj === 'object'
      ? 'statusCode' in obj && 'message' in obj
      : false;
  }
}
