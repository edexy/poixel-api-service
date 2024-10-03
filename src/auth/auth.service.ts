import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { UserRepository } from '@/users/repositories/user.repository';
import { CreateUserDTO } from '@/users/dto/create-users.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
      const salt = await bcrypt.genSalt();

      const hash = await bcrypt.hash(user.password, salt);
       user.password = hash

      user.id = nanoid(11); //set ID
      return await this.userRepository.store(user);
    } catch (err) {
      this.logger.error(err?.message)
      throw new InternalServerErrorException(err?.message);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
        if (await bcrypt.compare(password, foundUser.password)) {
            const { password, ...result } = foundUser
            return result;
        }

        return null;
    }
    return null

}
async login(user: any) {
    const payload = { email: user.email, id: user.id, role:user.role };

    return {
        user,
        accessToken: this.generateJwt(payload),
    };
}
}
