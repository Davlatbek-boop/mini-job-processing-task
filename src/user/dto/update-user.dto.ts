import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../../app.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newemail@gmail.com', description: 'Updated email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'NEW_PASSWORD_123', description: 'Updated password' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: true, description: 'Is user active?' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}