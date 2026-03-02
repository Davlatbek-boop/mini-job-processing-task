import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { TaskStatus } from '../../app.constants';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListTasksDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter tasks by status',
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Filter tasks by type (e.g., "email", "report")',
    example: 'email',
  })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Start date for filtering tasks (ISO 8601 format)',
    example: '2026-03-02T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering tasks (ISO 8601 format)',
    example: '2026-03-02T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination (minimum 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of tasks per page (minimum 1)',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
