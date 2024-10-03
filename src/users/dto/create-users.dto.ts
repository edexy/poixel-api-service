import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BusinessType, UserRole } from '../user.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  id?: string;

  @ApiProperty({ example: 'Joe Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'testemail@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'testP@ssW0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: BusinessType })
  @IsEnum(BusinessType)
  @IsString()
  @IsNotEmpty()
  businessType: BusinessType;

  role: UserRole;
}

export class CreateAdminDTO {
  id?: string;

  @ApiProperty({ example: 'Amin Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'testP@ssW0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;

  businessType?: string;

  role: UserRole;
}
