import { Controller, Get, Post, Body, Patch, Param, Query, Res, HttpCode, HttpStatus, UseGuards, Delete } from '@nestjs/common';
import { Response } from 'express';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from 'src/entities/user.entity';

import { RoomsService } from './rooms.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { RoomResponseDto } from './dto/room-dto';



export enum UserRole {
  teacher = 'teacher',
  student = 'student',
}

@ApiBearerAuth()
@Serialize(RoomResponseDto)
@ApiTags('Classroom')
@UseGuards(JwtAuthGuard)
@Controller('class')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService
  ) { }

  /**
   * Controller to Create new Classroom
   * @param createRoomDto 
   * @param user 
   * @returns 
   */
  @Post('create')

  @ApiOperation({ summary: "Create classroom" })
  @HttpCode(HttpStatus.OK)
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: User) {
    return this.roomsService.create(createRoomDto, user);
  }


  /**
  * Controller to find class of User - It accepts query param of type: teacher or student
  * @param type 
  * @param user 
  * @returns 
  */
  @Get('views')
  @ApiQuery({ name: 'type', enum: UserRole })
  @ApiOperation({ summary: "Find class of user" })
  async findRooms(@Query('type') type: string, @CurrentUser() user: User) {
    return await this.roomsService.findClassByUserId(user.id, type)
  }

  @Get(":id")
  getClassRoomById(@Param('id') classId: string, @CurrentUser() user: User) {
    return this.roomsService.findClassById(classId, user.id)
  }

  /**
   * Controller to generate Invite Code
   * @param classId 
   * @param currentUser 
   * @returns 
   */
  @Patch(':id/generate')
  @ApiOperation({ summary: "Generate Classroom Invite Code" })
  generate(@Param('id') classId: string, @CurrentUser() currentUser: User) {
    return this.roomsService.generateCode(classId, currentUser)
  }

  /**
   * Controller to remove class
   * @param classId 
   * @param currentUser 
   * @returns 
   */
  @Delete(':id')
  async remove(@Param("id") classId: string, @CurrentUser() currentUser: User) {
    return this.roomsService.removeClass(classId, currentUser.id)
  }

  /**
   * Controller to join class based on invite code
   * @param inviteCode 
   * @param currentUser 
   * @returns 
   */
  @Patch(':inviteCode/join')

  @ApiOperation({ summary: "Join classroom" })
  joinClass(@Param('inviteCode') inviteCode: string, @CurrentUser() currentUser: User) {
    return this.roomsService.joinClass(inviteCode, currentUser)
  }
}
