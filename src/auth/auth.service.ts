import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { UserRepository } from '@/users/repositories/user.repository';
import { CreateUserDTO } from '@/users/dto/create-users.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@/users/user.constants';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  generateJwt(payload) {
    const auth = this.configService.get('app.auth');
    return this.jwtService.sign(payload, auth);
  }

  async registerUser(user: CreateUserDTO) {
    try {
      const isEmailAlreadyExist = await this.userRepository.findByEmail(
        user.email,
      );
      if (isEmailAlreadyExist)
        throw new BadRequestException(
          `User with email: ${user.email}, already exists`,
        );
      const salt = await bcrypt.genSalt();

      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;

      user.id = nanoid(11); //set ID
      return await this.userRepository.store(user);
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message ?? 'An error occurred, please try again',
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
      if (await bcrypt.compare(password, foundUser.password)) {
        return foundUser;
      }

      return null;
    }
    return null;
  }
  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      user,
      accessToken: this.generateJwt(payload),
    };
  }

  async createAdmin(data) {
    try {
      data.role = UserRole.ADMIN;
      return await this.registerUser(data);
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message ?? 'An error occurred, please try again',
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
