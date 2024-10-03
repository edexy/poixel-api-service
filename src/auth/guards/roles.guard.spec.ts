import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@/users/user.constants';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles are required', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({})),
        })),
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined);

      const result = guard.canActivate(mockContext as any);

      expect(result).toBe(true);
    });

    it('should return true if user has required role', () => {
      const mockUser = {
        role: UserRole.ADMIN,
      };
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({ user: mockUser })),
        })),
      };
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([UserRole.ADMIN]);

      const result = guard.canActivate(mockContext as any);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user does not have required role', () => {
      const mockUser = {
        role: UserRole.USER,
      };
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({ user: mockUser })),
        })),
      };
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([UserRole.ADMIN]);

      expect(() => guard.canActivate(mockContext as any)).toThrow(
        new ForbiddenException(
          'You do not have the required permission to access this resource',
        ),
      );
    });
  });
});
