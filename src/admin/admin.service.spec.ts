import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UserRepository } from '@/users/repositories/user.repository';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { paginate } from '@/common/utils';

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: UserRepository;

  const mockUser: any = {
    id: '123',
    email: 'test@example.com',
    password: 'password',
    role: 'USER',
  };

  const mockUsers = [
    {
      id: '123',
      email: 'test@example.com',
      password: 'password',
      role: 'USER',
    },
    {
      id: '456',
      email: 'test2@example.com',
      password: 'password',
      role: 'USER',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: UserRepository,
          useValue: {
            findAllUser: jest.fn(),
            findById: jest.fn(),
            updateOne: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users with pagination', async () => {
      const pageSize = 20;
      const page = 1;
      const mockFindAllUserResult = {
        rows: mockUsers,
        count: mockUsers.length,
      };
      jest
        .spyOn(userRepository, 'findAllUser')
        .mockResolvedValue(mockFindAllUserResult);

      const result = await service.getAllUsers(pageSize, page);

      expect(userRepository.findAllUser).toHaveBeenCalledWith(pageSize, page);
      expect(result).toEqual({
        users: mockUsers,
        pagination: paginate(mockUsers.length, pageSize, page),
      });
    });

    it('should handle errors', async () => {
      const errorMessage = 'An error occurred';
      jest
        .spyOn(userRepository, 'findAllUser')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.getAllUsers(20, 1)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '123';
      const updateData: any = {
        email: 'updated@example.com',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'updateOne').mockResolvedValue(undefined);

      const result = await service.updateUser(userId, updateData);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.updateOne).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '123';
      const updateData: any = {
        email: 'updated@example.com',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(service.updateUser(userId, updateData)).rejects.toThrow(
        new NotFoundException(`User with ID: ${userId} does not exist`),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '123';
      jest.spyOn(userRepository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteUser(userId);

      expect(userRepository.softDelete).toHaveBeenCalledWith(userId);
    });

    it('should handle errors', async () => {
      const userId = '123';
      const errorMessage = 'An error occurred';
      jest
        .spyOn(userRepository, 'softDelete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.deleteUser(userId)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
