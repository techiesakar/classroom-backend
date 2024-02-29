import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { validate as uuidValidate } from 'uuid';
import * as Random from "generate-password"
import { Room } from 'src/entities/room.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    private readonly userService: UsersService
  ) { }

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
          id: currentUser.id
        }
      }
    })
    if (existingRoom) {
      throw new ConflictException('Roomroom Already Exists')
    }

    const inviteCode = Random.generate({
      uppercase: false,
      length: 8,
      numbers: true
    })
    const result = this.roomRepo.create({
      ...createRoomDto,
      teacher: currentUser,
      inviteCode
    })
    return await this.roomRepo.save(result)
  }

  /**
   * Function to generate classroom Invite Code
   * @param classId 
   * @param currentUser 
   * @returns 
   */
  async generateCode(classId: string, currentUser: User) {
    const relations = {
      teacher: true,
      student: false
    }
    const existingRoom = await this.findClassById(classId, relations)
    if (!existingRoom) {
      throw new NotFoundException("Invalid RoomID")
    }

    if (existingRoom?.teacher?.id !== currentUser.id) {
      throw new UnauthorizedException()
    }

    const inviteCode = Random.generate({
      uppercase: false,
      length: 8,
      numbers: true
    })

    existingRoom.inviteCode = inviteCode

    Object.assign(existingRoom, existingRoom.inviteCode)
    return await this.roomRepo.save(existingRoom)
  }

  /**
   * Function to join the class. It needs invite code, and currentUser for authorization
   * @param inviteCode 
   * @param currentUser 
   */
  async joinClass(inviteCode: string, currentUser: User) {
    const existingRoom = await this.findClassByCode(inviteCode)

    if (!existingRoom) {
      throw new NotFoundException("Room doesn't exist")
    }
    if (currentUser.classesTaught.some(room => room.id === existingRoom.id)) {
      throw new ConflictException("You are an instructor of this class")
    }
    if (currentUser.classesEnrolled.some(room => room.id === existingRoom.id)) {
      throw new ConflictException("You are already a student")
    }

    currentUser.classesEnrolled.push(existingRoom)
    return await this.userService.updateUser(currentUser)
  }


  /**
   * Function to find class by ID. Optional: We can pass relation object with boolean value of teacher and students
   * @param classId 
   * @param relations 
   * @returns 
   */
  async findClassById(classId: string, relations?: any) {
    if (!uuidValidate(classId)) {
      return null
    }
    const existingRoom = await this.roomRepo.findOne({
      where: {
        id: classId
      },
      relations: {
        teacher: true,
        students: true
      }
    })

    if (!existingRoom) {
      return null
    }
    return existingRoom
  }


  /**
  * Function to find class by ID. Optional: We can pass relation object with boolean value of teacher and students
  * @param classId 
  * @param relations 
  * @returns 
  */
  async findClassByUserId(userId: string, type: string) {
    if (!uuidValidate(userId)) {
      return null
    }
    const existingUser = await this.userService.findOneById(userId)

    if (!existingUser) {
      return null
    }


    const query = this.roomRepo.createQueryBuilder("room").leftJoinAndSelect("room.students", "student")
      .leftJoinAndSelect("room.teacher", "teacher")

    const userClasses = await query
      .where(`${type === "student" ? "student.id = :userId" : "student.id = :userId OR teacher.id = :userId"}`, { userId })
      .select(["room.id",
        "room.name",
        "room.subject",
        "room.inviteCode",
        "teacher.id",
        "teacher.name"]).getMany();
    return userClasses;
  }


  /**
   * Function to retrieve class based on its inviteCode
   * @param inviteCode 
   * @param relations 
   * @returns 
   */
  async findClassByCode(inviteCode: string, relations?: any) {
    if (!inviteCode) {
      return null
    }
    const existingRoom = await this.roomRepo.findOne({
      where: {
        inviteCode: inviteCode
      }, relations: {
        teacher: true,
        students: true
      }
    })

    if (!existingRoom) {
      return null
    }
    return existingRoom
  }




}
