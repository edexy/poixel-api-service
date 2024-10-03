import {
  Entity,
  Column,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BusinessType, UserRole } from '../user.constants';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({
    length: 11,
    unique: true,
  })
  id?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @Index('idx_user_email')
  email: string;

  @Column({ nullable: true })
  businessType: BusinessType;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({
    nullable: false,
    default: UserRole.USER,
  })
  @Index()
  role: UserRole;

  @Column({ default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
