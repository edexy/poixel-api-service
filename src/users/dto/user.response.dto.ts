import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

// export class User {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   firstName: string;

//   @ApiProperty()
//   lastName: string;

//   @ApiProperty()
//   email: string;

//   @ApiProperty()
//   phoneNumber: string;

//   @ApiProperty()
//   address: string;

//   @ApiProperty()
//   userType: string;

//   @ApiProperty()
//   photo: string;

//   @ApiProperty()
//   isActive: boolean;

//   @ApiProperty()
//   isVerified: boolean;

//   @ApiProperty()
//   isPhoneNumberVerified: boolean;

//   @ApiProperty()
//   createdAt: Date;
// }
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
