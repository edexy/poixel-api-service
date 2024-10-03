import { Request } from 'express';

export interface HttpRequest extends Request {
  __manager_id: string;
}
