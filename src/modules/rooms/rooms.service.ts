import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as Random from 'generate-password';
import { Room } from '../../entities/room.entity';
import { RoomResponseDto } from './dto/room-dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Injectable()
@Serialize(RoomResponseDto)
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Function to create classroom
   * @param createRoomDto
   * @param currentUser
   * @returns
   */
  async create(createRoomDto: CreateRoomDto, currentUser: User) {
    const existingRoom = await this.roomRepo.findOne({
      where: {
        name: ILike(createRoomDto.name),
        teacher: {
          id: currentUser.id,
        },
      },
    });
    if (existingRoom) {
      throw new ConflictException('Roomroom Already Exists');
    }

    const inviteCode = Random.generate({
      uppercase: false,
      length: 8,
      numbers: true,
    });
    const result = this.roomRepo.create({
      ...createRoomDto,
      teacher: currentUser,
      inviteCode,
    });
    const response = await this.roomRepo.save(result);
    // return CustomRoom.parse(response)
    return response;
  }

  /**
   * Function to generate classroom Invite Code
   * @param classId
   * @param currentUser
   * @returns
   */
  async generateCode(classId: string, currentUser: User) {
    const existingRoom = await this.findClassById(classId, currentUser.id);
    if (!existingRoom) {
      throw new NotFoundException('Invalid RoomID');
    }

    if (existingRoom?.teacher?.id !== currentUser.id) {
      throw new UnauthorizedException();
    }

    const inviteCode = Random.generate({
      uppercase: false,
      length: 8,
      numbers: true,
    });

    Object.assign(existingRoom, {
      inviteCode,
    });

    return await this.roomRepo.save(existingRoom);
  }

  /**
   * Function to join the class. It needs invite code, and currentUser for authorization
   * @param inviteCode
   * @param currentUser
   */
  async joinClass(inviteCode: string, currentUser: User) {
    const existingRoom = await this.findClassByCode(inviteCode);

    if (!existingRoom) {
      throw new NotFoundException("Room doesn't exist");
    }
    if (currentUser.classesTaught.some((room) => room.id === existingRoom.id)) {
      throw new ConflictException('You are an instructor of this class');
    }
    if (
      currentUser.classesEnrolled.some((room) => room.id === existingRoom.id)
    ) {
      throw new ConflictException('You are already a student');
    }

    currentUser.classesEnrolled.push(existingRoom);
    const updateUser = await this.userRepo.save(currentUser);
    if (updateUser) {
      return existingRoom;
    } else {
      throw new ForbiddenException('Not authorized');
    }
  }

  /**
   * Function to find class by ID. Optional: We can pass relation object with boolean value of teacher and students
   * @param classId
   * @param userId
   * @returns
   */
  async findClassById(classId: string, userId: string) {
    if (!userId) {
      return null;
    }

    const query = this.roomRepo
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.teacher', 'teacher')
      .leftJoinAndSelect('room.students', 'student')
      .leftJoinAndSelect('room.announcements', 'announcement')
      .where('teacher.id = :userId OR student.id = :userId', { userId })
      .where('room.id = :classId', { classId })
      .orderBy('announcement.updatedAt', 'DESC');
    const existingRoom = await query.getOne();

    if (!existingRoom) {
      return null;
    }
    return existingRoom;
  }

  /**
   * Function to retrieve class based on its inviteCode
   * @param inviteCode
   * @param relations
   * @returns
   */
  async findClassByCode(inviteCode: string) {
    if (!inviteCode) {
      return null;
    }
    const existingRoom = await this.roomRepo.findOne({
      where: {
        inviteCode: inviteCode,
      },
      relations: {
        teacher: true,
        students: true,
      },
    });

    if (!existingRoom) {
      return null;
    }
    return existingRoom;
  }

  async removeClass(classId: string, userId: string) {
    const existingRoom = await this.findClassById(classId, userId);
    if (existingRoom.teacher.id !== userId || !existingRoom) {
      throw new UnauthorizedException();
    }
    return await this.roomRepo.softRemove(existingRoom);
  }

  async unEnroll(classId: string, currentUser: User) {
    const existingRoom = await this.findClassById(classId, currentUser.id);
    if (!existingRoom) {
      throw new NotFoundException();
    }
    // Filter out the room to be unenroll
    currentUser.classesEnrolled = currentUser.classesEnrolled.filter(
      (room) => room.id !== classId,
    );
    return await this.userRepo.save(currentUser);
  }

  /**
   * Function to check whether the user is teacher or not
   * @param existingRoom
   * @param currentUser
   * @returns Boolean
   */
  isTeacher(existingRoom: Room, currentUser: User) {
    return existingRoom.teacher.id === currentUser.id;
  }

  /**
   * Function to check whether the user is student of the room or not
   * @param existingRoom
   * @param currentUser
   * @returns Boolean
   */
  isStudent(existingRoom: Room, currentUser: User) {
    return currentUser.classesEnrolled.some(
      (room) => room.id === existingRoom.id,
    );
  }

  isStudentOrTeacher(existingRoom: Room, currentUser: User) {
    return (
      existingRoom.teacher.id === currentUser.id ||
      currentUser.classesEnrolled.some((room) => room.id === existingRoom.id)
    );
  }
}
