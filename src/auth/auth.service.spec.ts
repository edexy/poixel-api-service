import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { UserRepository } from '../users/repositories/user.repository';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-users.dto';
import { BusinessType, UserRole } from '@/users/user.constants';

jest.mock('bcrypt');
jest.mock('nanoid');
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(() => ({ secret: 'test-secret' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findAllUser: jest.fn(),
            findById: jest.fn(),
            updateOne: jest.fn(),
            softDelete: jest.fn(),
            findByEmail: jest.fn(),
            store: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userDto: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        businessType: BusinessType.CORPORATION,
        role: UserRole.USER,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (nanoid as jest.Mock).mockReturnValue('mocked-user-id');
      const createdUser = {
        id: 'mocked-user-id',
        ...userDto,
        password: 'hashedPassword',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'store').mockResolvedValue(createdUser);

      const result = await service.registerUser(userDto);

      expect(result).toEqual(createdUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
      expect(userRepository.store).toHaveBeenCalledWith({
        ...userDto,
        id: expect.any(String),
        password: expect.any(String),
      });
    });

    it('should throw an error if email is already in use', async () => {
      const userDto: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        businessType: BusinessType.CORPORATION,
        role: UserRole.USER,
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
        id: '1',
        ...userDto,
        password: 'hashedpassword',
      });

      await expect(service.registerUser(userDto)).rejects.toThrow(
        new BadRequestException(`User ${userDto.email} already exists`),
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
      expect(userRepository.store).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const user = {
        id: 'some-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        businessType: 'agency',
        role: 'user',
      };

      // Mock bcrypt.compare to resolve to true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(userRepository as any, 'findByEmail').mockResolvedValue(user);
      const isValid = await service.validateUser(user.email, user.password);
      expect(isValid).toEqual(user);
    });

    it('should return null if user was not validated', async () => {
      const user = {
        id: 'some-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        businessType: 'agency',
        role: 'user',
      };

      // Mock bcrypt.compare to resolve to true
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      jest.spyOn(userRepository as any, 'findByEmail').mockResolvedValue(user);
      const isValid = await service.validateUser(user.email, user.password);
      expect(isValid).toEqual(null);
    });
  });

  describe('login', () => {
    it('should generate a JWT token on successful login', async () => {
      const user = {
        id: 'some-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        businessType: 'agency',
        role: 'user',
      };
      (mockJwtService.sign as jest.Mock).mockReturnValue('test-token');
      const result = await service.login(user);
      expect(result).toEqual({
        user,
        accessToken: 'test-token',
      });
    });
  });
  describe('createAdmin', () => {
    it('should create an admin user', async () => {
      const adminDto = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (nanoid as jest.Mock).mockReturnValue('mocked-admin-id');

      const createdAdmin: any = {
        id: 'mocked-admin-id',
        ...adminDto,
        password: 'hashedpassword',
        role: UserRole.ADMIN,
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'store').mockResolvedValue(createdAdmin);

      const result = await service.createAdmin(adminDto);

      expect(result).toEqual(createdAdmin);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(adminDto.email);
      expect(userRepository.store).toHaveBeenCalledWith({
        ...adminDto,
        id: expect.any(String),
        password: 'hashedpassword',
        role: UserRole.ADMIN,
      });
    });

    it('should throw an error if admin email is already in use', async () => {
      const adminDto = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
        id: '1',
        ...adminDto,
        password: 'hashedpassword',
        role: UserRole.ADMIN,
        businessType: null,
      });

      await expect(service.createAdmin(adminDto)).rejects.toThrow(
        new BadRequestException(`User ${adminDto.email} already exists`),
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(adminDto.email);
      expect(userRepository.store).not.toHaveBeenCalled();
    });
  });
});
