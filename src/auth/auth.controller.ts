import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserResponseDto,
} from '@/users/dto/user.response.dto';
import { CreateAdminDTO, CreateUserDTO } from '@/users/dto/create-users.dto';
import { UserLoginDTO } from './login.dto';
import { LocalAuthGuard } from './guards/jwt-local.guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'registered user details',
    type: UserResponseDto,
  })
  @ApiOperation({ description: 'Register a user' })
  async register(@Body() data: CreateUserDTO) {
    const user  = await this.authService.registerUser(data);
    return {
      _metadata: { message: 'Signed Up Successfully' },
      data: user,
    };
  }

  @UseGuards(LocalAuthGuard)
   @Post('login')
   @ApiOkResponse({
    description: 'Logged in user details',
    type: UserResponseDto,
  })
  @ApiOperation({ description: 'User login' })
   async login(@Req() req, @Body() data: UserLoginDTO) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const user = await this.authService.login(req.user)
    return {
      _metadata: { message: 'Logged In Successfully' },
      data: user,
    };
   }

   @Post('admin')
   async createAdmin(@Body() data: CreateAdminDTO) {
    await this.authService.createAdmin(data)
    return {
      _metadata: { message: 'Admin created Successfully' },
      data: null,
    };
   }

}
