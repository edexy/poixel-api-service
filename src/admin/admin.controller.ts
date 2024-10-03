import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/auth/guards/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UserRole } from '@/users/user.constants';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateUserDTO } from '@/users/dto/update-user.dto';
import { UserResponseDto } from '@/users/dto/user.response.dto';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/users')
  @ApiQuery({ name: 'pageSize', example: 20, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiOperation({ description: 'Get all registered clients' })
  @ApiOkResponse({
    description: 'All users details',
    type: [UserResponseDto],
  })
  async getAllUsers(
    @Query('pageSize') pageSize: number = 20,
    @Query('page') page: number = 1,
  ) {
    const { users, pagination } = await this.adminService.getAllUsers(
      pageSize,
      page,
    );
    return {
      _metadata: { pagination, message: 'clients fetched  successfully' },
      data: users,
    };
  }

  @Put('users/:userId')
  @ApiOperation({ description: 'Modify client details.' })
  @ApiOkResponse({
    description: 'Updated user details',
    type: UserResponseDto,
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: UpdateUserDTO,
  ) {
    const user = await this.adminService.updateUser(userId, data);
    return {
      _metadata: { message: 'User details updated Successfully' },
      data: user,
    };
  }

  @Delete('users/:userId')
  @ApiOperation({ description: 'Delete client' })
  @ApiOkResponse({
    description: 'User details deleted',
    type: null,
  })
  async deleteUser(@Param('userId') userId: string) {
    await this.adminService.deleteUser(userId);
    return {
      _metadata: { message: 'User account deleted Successfully' },
      data: null,
    };
  }
}
