import { ApiProperty } from '@nestjs/swagger';
import { BusinessType, UserRole } from '../user.constants';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  businessType: BusinessType;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}
export class UserResponseDto {
  @ApiProperty()
  statusCode: number = 200;
  @ApiProperty()
  message: string = 'success';
  @ApiProperty()
  data: User;
  @ApiProperty()
  accessToken: string;
}

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number = 400;
  @ApiProperty()
  message: string | string[] = 'error message';
  @ApiProperty()
  validationErrors: [];
}
