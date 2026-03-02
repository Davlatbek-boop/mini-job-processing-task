import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../app.constants';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @ApiProperty({ example: 'user_unique_id', description: 'unique id by user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'aliyevali@gmail.com', description: 'users email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashed_password_string',
    description: 'users hashed password',
  })
  @Column()
  password_hash: string;

  @ApiProperty({ example: 'USER', description: 'users role' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ example: true, description: 'users active' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({
    example: '2025-05-30T10:00:00.000Z',
    description: 'users date created',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2025-05-30T10:00:00.000Z',
    description: 'users date updated',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
