import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.username);
    if (userExist) {
      throw new ConflictException('User Already Exist', {
        cause: new Error(),
        description: 'Kindly login with your existing email',
      });
    }
    const { password, ...data } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await this.userRepo.save({
      email: createUserDto.username,
      password: hashPassword,
      ...data,
    });
    return {
      message: 'Registered Successfully',
      ...result,
    };
  }

  /**
   * This function is responsible to update user basic information
   * eg: Name, email, address, phone
   * @param updateUserDto
   * @param currentUser
   * @returns
   */
  async updateUser(updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findOneByEmail(currentUser.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  // Find single user by ID
  async findOneById(id: string) {
    if (!uuidValidate(id)) {
      return null;
    }
    const result = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: {
        classesEnrolled: true,
        classesTaught: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  // Find single user by email
  async findOneByEmail(email: string) {
    if (!email) {
      return null;
    }

    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  }

  findAll() {
    return this.userRepo.find();
  }

  async findUserClasses(id: string, type: string) {
    const existingUser = await this.findOneById(id);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid User');
    }

    if (type == 'student') {
      return existingUser.classesEnrolled;
    } else {
      return existingUser.classesTaught;
    }
  }

  /**
   * This function save the data as it is it comes - This is made for enrolling and leaving class
   * This function should only be triggered from room service
   * I don't want to pull the user repo in user service just for this
   * @param currentUser
   * @returns
   */
  async updateUserClass(filteredUserWithClass: User) {
    return await this.userRepo.save(filteredUserWithClass);
  }
}
