import { ValidationError } from '@nestjs/common';

export interface ErrorException {
  statusCode: number;
  message: string | string[];
  errors: ValidationError[];
}
