import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import * as bcrypt from "bcrypt"
import { User } from 'src/entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

  ) { }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.username)
    if (userExist) {
      throw new ConflictException('User Already Exist', { cause: new Error(), description: 'Kindly login with your existing email' })
    }
    const { password, ...data } = createUserDto
    const hashPassword = await bcrypt.hash(password, 10)
    const result = await this.userRepo.save({
      email: createUserDto.username,
      password: hashPassword,
      ...data
    })
    return {
      message: "Registered Successfully",
      ...result
    }
  }

  async updateUser(updateUserDto: any) {
    return await this.userRepo.save(updateUserDto)
  }

  // Find single user by ID
  async findOneById(id: string) {
    if (!uuidValidate(id)) {
      return null
    }
    const result = await this.userRepo.findOne({
      where: {
        id
      },
      relations: {
        classesEnrolled: true,
        classesTaught: true
      }
    })

    if (!result) {
      return null
    }

    return result
  }

  // Find single user by email
  async findOneByEmail(email: string) {
    if (!email) {
      return null
    }

    const user = await this.userRepo.findOne({
      where: {
        email
      }
    })

    if (!user) {
      return null
    }
    return user
  }

  findAll() {
    return this.userRepo.find()
  }

  async findUserClasses(id: string, type: string) {
    const existingUser = await this.findOneById(id)
    if (!existingUser) {
      throw new UnauthorizedException("Invalid User")
    }

    if (type == "student") {
      return existingUser.classesEnrolled
    }
    else {
      return existingUser.classesTaught
    }

  }

}
