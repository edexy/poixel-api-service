import { HttpStatus } from '@nestjs/common';
import { Pagination } from '../types';

export interface ResponseMetadata {
  httpStatus?: HttpStatus;
  statusCode?: HttpStatus;
  message?: string;
  pagination?: Pagination;
  accessToken?: string;
}

export interface HttpResponse<T = any> {
  _metadata?: ResponseMetadata;
  data?: T;
  token?: string;
}
