import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles-auth.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserSelfGuard } from '../common/guards/user-self.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns list of users.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: You do not have permission.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(UserSelfGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user details.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: You do not have permission.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserSelfGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: You do not have permission.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: You do not have permission.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
