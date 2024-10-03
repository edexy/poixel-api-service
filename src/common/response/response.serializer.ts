import { Exclude } from 'class-transformer';

export class ResponseSerializer {
  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
