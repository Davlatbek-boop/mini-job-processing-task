import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Conflict: User already exists.' })
  register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createUserDto, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return access & refresh tokens' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials.',
  })
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and invalidate refresh token' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or missing token.',
  })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access token issued successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or expired refresh token.',
  })
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
