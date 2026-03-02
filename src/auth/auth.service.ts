import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import ms from 'ms';
import { config, env } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = await this.userService.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    const tokens = await this.generateToken(newUser);

    res.cookie('refresh-token-user', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_COOKIE_TIME),
    });

    return {
      message: 'User logged successfully',
      token: tokens.accessToken,
    };
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const validPassword = await bcrypt.compare(
      loginUserDto.password,
      user.password_hash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const tokens = await this.generateToken(user);

    res.cookie('refresh-token-user', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_COOKIE_TIME),
    });

    return {
      message: 'User logged successfully',
      token: tokens.accessToken,
    };
  }

  async logout(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies['refresh-token-user'];

    if (!cookieRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = await this.jwtService.decode(cookieRefreshToken);

    if (!payload) {
      throw new UnauthorizedException('Incorrect refresh token');
    }

    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('User not found with that refresh token');
    }

    res.clearCookie('refresh-token-user', {
      httpOnly: true,
    });

    return {
      message: 'User logged out',
    };
  }

  async refreshToken(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies['refresh-token-user'];

    if (!cookieRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = await this.jwtService.decode(cookieRefreshToken);

    if (!payload) {
      throw new UnauthorizedException('Incorrect refresh token');
    }

    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('User not found with that refresh token');
    }

    const tokens = await this.generateToken(user);

    res.cookie('refresh-token-user', tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_COOKIE_TIME),
    });

    return {
      message: 'User logged successfully',
      token: tokens.accessToken,
    };
  }

  async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: Number(process.env.ACCESS_TOKEN_TIME),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: Number(process.env.REFRESH_TOKEN_TIME),
    });

    return { accessToken, refreshToken };
  }
}
