import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../app.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create({
      ...createUserDto,
      role: UserRole.USER,
      password_hash: createUserDto.password,
    });

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({ id, ...updateUserDto });
    if (!user) {
      throw new BadRequestException('this user not found');
    }
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('this user not found');
    }
    this.userRepo.delete(id);
    return {
      message: `User by ${id} ID removed`,
    };
  }
}
