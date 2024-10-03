import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserResponseDto,
} from '@/users/dto/user.response.dto';
import { CreateUserDTO } from '@/users/dto/create-users.dto';
import { UserLoginDTO } from './login.dto';
import { LocalAuthGuard } from './guards/jwt-local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'registered user details',
    type: UserResponseDto,
  })
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
   async login(@Req() req, @Body() data: UserLoginDTO) {
    const user = await this.authService.login(req.user)
    return {
      _metadata: { message: 'Logged In Successfully' },
      data: user,
    };
   }

}
