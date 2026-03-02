import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { TaskPriority } from '../../app.constants';

export class CreateTaskDto {
  @ApiProperty({
    example: 'send_email',
    description: 'Type of the task.',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'high',
    description: 'Priority level of the task.',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    example: { userId: 12, email: 'user@mail.com' },
    description: 'Data required to execute the task.',
    type: Object,
  })
  @IsObject()
  payload: Record<string, any>;

  @ApiPropertyOptional({
    example: '2026-03-02T14:31:00Z',
    description:
      'Time when the task should run (ISO format). If not provided, it runs immediately.',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    example: 'unique-key-12345',
    description: 'Unique key to prevent duplicate task creation.',
  })
  @IsString()
  idempotencyKey: string;
}
