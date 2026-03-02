import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority, TaskStatus } from '../../app.constants';
import { User } from '../../user/entities/user.entity';


@Index('idx_task_user_id', ['user_id'])
@Index('idx_task_status', ['status'])
@Index('idx_task_type', ['type'])
@Index('idx_task_scheduled_at', ['scheduled_at'])
@Index('idx_task_idempotency_key', ['idempotency_key'])
@Entity()
export class Task {
  @ApiProperty({ example: 'a1b2c3d4-uuid', description: 'Unique task id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'b6b5f9f2-9a9c-4e7a-9e1b-123456789abc',
    description: 'ID of the user who owns this task',
  })
  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({
    type: () => User,
    description: 'Owner of the task',
  })
  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ example: 'email', description: 'Type of task' })
  @Column()
  type: string;

  @ApiProperty({
    example: 'NORMAL',
    description: 'Task priority',
    enum: TaskPriority,
  })
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.NORMAL })
  priority: TaskPriority;

  @ApiProperty({
    example: { to: 'user@gmail.com' },
    description: 'Task data payload',
  })
  @Column({ type: 'jsonb' })
  payload: any;

  @ApiProperty({
    example: 'PENDING',
    description: 'Current status of the task',
    enum: TaskStatus,
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ example: 'unique-key-123', description: 'Idempotency key' })
  @Column({ type: 'varchar', length: 255, unique: true })
  idempotency_key: string;

  @ApiProperty({ example: 0, description: 'Number of processing attempts' })
  @Column({ default: 0 })
  attempts: number;

  @ApiProperty({
    example: 'Error message',
    description: 'Last error occurred',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  last_error: string;

  @ApiProperty({
    example: '2026-03-02T10:00:00Z',
    description: 'Scheduled execution time',
    nullable: true,
  })
  @Column({ type: 'timestamptz', nullable: true })
  scheduled_at: Date;

  @ApiProperty({
    example: '2026-03-02T10:01:00Z',
    description: 'Task start time',
    nullable: true,
  })
  @Column({ type: 'timestamptz', nullable: true })
  started_at: Date;

  @ApiProperty({
    example: '2026-03-02T10:02:30Z',
    description: 'Task completion time',
    nullable: true,
  })
  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;

  @ApiProperty({
    example: '2026-03-02T10:00:00Z',
    description: 'Task creation timestamptz',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2026-03-02T10:02:30Z',
    description: 'Task last update timestamptz',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
