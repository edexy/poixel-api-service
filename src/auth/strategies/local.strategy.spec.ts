import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate user credentials and return the user if successful', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'password',
        role: 'USER',
      };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await strategy.validate(email, password);

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      const email = 'test@example.com';
      const password = 'password';
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(strategy.validate(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });
  });
});
