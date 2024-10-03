import { Injectable, NestMiddleware } from '@nestjs/common';
import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestJsonBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, (err: Error) => {
      if (err) {
        return next(err);
      }

      next();
    });
  }
}
