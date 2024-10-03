import { AppEnvironment } from '@/common/constants/app.enum.constant';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestCorsMiddleware implements NestMiddleware {
  private readonly allowOrigin: string[];
  private readonly allowHeader: string[];
  private readonly allowMethod: string[];
  private readonly appEnv: AppEnvironment;

  constructor(private readonly configService: ConfigService) {
    this.allowOrigin = this.configService.get<string[]>(
      'request.cors.allowOrigin',
    );
    this.allowHeader = this.configService.get<string[]>(
      'request.cors.allowHeader',
    );
    this.allowMethod = this.configService.get<string[]>(
      'request.cors.allowMethod',
    );
    this.appEnv = this.configService.get<AppEnvironment>('app.env');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const allowOrigin =
      this.appEnv === AppEnvironment.PRODUCTION ? this.allowOrigin : '*';

    const corsOptions: CorsOptions = {
      origin: allowOrigin,
      methods: this.allowMethod,
      allowedHeaders: this.allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}
