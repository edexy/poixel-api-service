import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/users/user.constants';

export class UserLoginDTO {
  @ApiProperty({ example: 'testemail@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'testP@ssW0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;

  role?: UserRole;
}
