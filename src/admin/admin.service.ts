import { paginate } from '@/common/utils';
import { UpdateUserDTO } from '@/users/dto/update-user.dto';
import { UserRepository } from '@/users/repositories/user.repository';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class AdminService {
    private logger = new Logger(AdminService.name);
    constructor(private readonly userRepository: UserRepository){}

    async getAllUsers(pageSize, page){
        try {
         const users = await this.userRepository.findAllUser(pageSize, page)
            const pagination = paginate(
                users.count,
                pageSize,
                page,
              );
              return {users: users.rows, pagination}
        } catch (error) {
            this.logger.error(error?.message)
      throw new HttpException(error?.message ?? 'An error occurred, please try again', error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUser(userId: string, data: UpdateUserDTO){
        try {
            const user = await this.userRepository.findById(userId);
            if(!user) throw new NotFoundException(`User with ID: ${userId} does not exist`);
            await this.userRepository.updateOne(userId, data)
            return  await this.userRepository.findById(userId);
        } catch (error) {
            this.logger.error(error?.message)
            throw new HttpException(error?.message ?? 'An error occurred, please try again', error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(userId: string){
        try {
            await this.userRepository.softDelete(userId)
        } catch (error) {
            this.logger.error(error?.message)
            throw new HttpException(error?.message ?? 'An error occurred, please try again', error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
