import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Room } from 'src/entities/room.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  // This return all user in database
  findAll() {
    return this.userRepo.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  /**
   * Function to register a user
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.username);
    if (userExist) {
      throw new ConflictException('User Already Exist', {
        cause: new Error(),
        description: 'Kindly login with your existing email',
      });
    }
    const { password, ...data } = createUserDto;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
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

  // This display single user data with enrolled class
  async findOneWithEnrolledClass(id: string) {
    const result = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: {
        classesEnrolled: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  // This display single user data with classes he/she taught
  async findOneWithClassTaught(id: string) {
    const result = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: {
        classesTaught: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  // This display single user data with - all classes he/she involved
  async findOneWithAllClass(id: string) {
    const result = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: {
        classesTaught: true,
        classesEnrolled: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  // Find single user by ID
  async findOneById(id: string) {
    const result = await this.userRepo.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  // Find single user by email
  async findOneByEmail(email: string, showPassword?: boolean) {
    if (!email) {
      return null;
    }

    const user = await this.userRepo.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        password: showPassword || false,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /** --------------------------- These below function returns the room of belonging user --------------------------- */
  async findRoomByUserId(userId: string, type: string) {
    if (type == 'student') {
      return this.findRoomEnrolled(userId);
    } else if (type == 'teacher') {
      return this.findRoomTeaches(userId);
    } else {
      return this.findUsersRoom(userId);
    }
  }

  async findRoomEnrolled(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['classesEnrolled', 'classesEnrolled.teacher'],
    });

    const filteredData = user.classesEnrolled.map((room) => ({
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      subject: room.subject,
      teacher: {
        id: room.teacher.id,
        name: room.teacher.name,
      },
    }));

    return filteredData;
  }

  async findRoomTeaches(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['classesTaught', 'classesTaught.teacher'],
    });

    const filteredData = user.classesTaught.map((room) => ({
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      subject: room.subject,
      teacher: {
        id: room.teacher.id,
        name: room.teacher.name,
      },
    }));
    return filteredData;
  }

  async findUsersRoom(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'classesTaught',
        'classesTaught.teacher',
        'classesEnrolled',
        'classesEnrolled.teacher',
      ],
    });

    const classesTaught = user.classesTaught.map((room) => ({
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      subject: room.subject,
      teacher: {
        id: room.teacher.id,
        name: room.teacher.name,
      },
    }));

    const classesEnrolled = user.classesEnrolled.map((room) => ({
      id: room.id,
      name: room.name,
      inviteCode: room.inviteCode,
      subject: room.subject,
      teacher: {
        id: room.teacher.id,
        name: room.teacher.name,
      },
    }));

    return [...classesTaught, ...classesEnrolled];
  }
}
