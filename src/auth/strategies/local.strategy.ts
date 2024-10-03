import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger(LocalStrategy.name);
    constructor(private authService: AuthService) {
       super({usernameField: 'email', 
        passwordField: 'password' });
   }

   async validate(email: string, password: string): Promise<any> {
    this.logger.log('validating user credentials')
       const foundUser = await this.authService.validateUser(email, password);
       if (!foundUser) {
           throw new UnauthorizedException('Invalid email or password');
       }
       return foundUser;
   }
}