import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@/users/repositories/user.repository';
import { UserRole } from '@/users/user.constants';

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('app.auth.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }
}
