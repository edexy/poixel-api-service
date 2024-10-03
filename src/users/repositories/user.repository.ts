import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../dto/create-users.dto';
import { Logger } from '@nestjs/common';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserRole } from '../user.constants';

export class UserRepository extends Repository<User> {
  private logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  public async findAllUser(pageSize: number, page: number): Promise<any> {
    const pageNo = page || 1;
    const pageLimit = pageSize || 20;
    const offset = (pageNo - 1) * pageLimit;
    const sortBy = `users.createdAt`;
    const order = 'DESC';
    const query = this.createQueryBuilder('users').where('users.role = :role', {
      role: UserRole.USER,
    });
    const [rows, count] = await query
      .take(pageLimit)
      .skip(offset)
      .orderBy({
        [sortBy]: { order: order || 'DESC', nulls: 'NULLS LAST' },
      })
      .getManyAndCount();
    return { rows, count };
  }

  public async findById(id: string): Promise<User | null> {
    return this.findOne({
      where: { id: id ?? '' },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email: email ?? '' });
  }

  public async store(user: CreateUserDTO) {
    this.logger.log(`about creating user with ID: ${user.id}`);
    const newUser = this.create(user);
    return this.save(newUser);
  }

  public async updateOne(userId: string, data: Partial<UpdateUserDTO>) {
    return this.update({ id: userId }, data);
  }

  public async destroy(id: string): Promise<void> {
    await this.softDelete(id);
  }
}
