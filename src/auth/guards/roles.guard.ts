import { UserRole } from '@/users/user.constants';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user, url, method } = context.switchToHttp().getRequest();
    this.logger.log(
      `${method} ${url} >> requiredRoles: ${requiredRoles?.toString()}`,
    );
    if (!requiredRoles.includes(user.role))
      throw new ForbiddenException(
        'You do not have the required permission to access this resource',
      );
    else return true;
  }
}
