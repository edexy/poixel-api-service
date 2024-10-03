import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { HttpResponse } from './common/response/response.interface';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  ping(): HttpResponse {
    return {
      _metadata: { message: this.appService.ping() },
    };
  }
}
