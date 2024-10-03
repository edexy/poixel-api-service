import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@/users/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'test-secret'),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user if found', async () => {
      const payload: any = {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      };
      const mockUser: any = {
        id: '123',
        email: 'test@example.com',
        password: 'password',
        role: 'USER',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(userRepository.findById).toHaveBeenCalledWith(payload.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload: any = {
        id: '123',
        email: 'test@example.com',
        role: 'USER',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Please log in to continue'),
      );
    });
  });
});
