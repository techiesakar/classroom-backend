import { Controller, Get, Post, Body, Patch, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from 'src/entities/user.entity';

import { RoomsService } from './rooms.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { CurrentUser } from '../users/decorators/current-user.decorators';


export enum UserRole {
  teacher = 'teacher',
  student = 'student',
}

@ApiBearerAuth()
@ApiTags('Classroom')
@Controller('class')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService,
    private readonly userService: UsersService
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
  findRooms(@Query('type') type: string, @CurrentUser() user: User) {
    return this.roomsService.findClassByUserId(user.id, type)
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
