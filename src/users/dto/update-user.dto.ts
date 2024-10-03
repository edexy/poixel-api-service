import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BusinessType, UserRole } from '../user.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: BusinessType })
  @IsEnum(BusinessType)
  @IsString()
  @IsNotEmpty()
  businessType: BusinessType;

  role?: UserRole;
}
