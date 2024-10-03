import { Injectable, NestMiddleware } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestCookieParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    cookieParser()(req, res, (err: any) => {
      if (err) {
        return next(err);
      }

      return next();
    });
  }
}
