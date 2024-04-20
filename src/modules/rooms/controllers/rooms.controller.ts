import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { User } from 'src/entities/user.entity';

import { RoomsService } from '../services/rooms.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../users/decorators/current-user.decorators';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { RoomResponseDto } from '../dto/room-dto';

@ApiBearerAuth()
@Serialize(RoomResponseDto)
@ApiTags('Classroom')
@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  /**
   * Controller to Create new Classroom
   * @param createRoomDto
   * @param user
   * @returns
   */
  @Post('create')
  @ApiOperation({ summary: 'Create classroom' })
  @HttpCode(HttpStatus.OK)
  create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: User) {
    return this.roomsService.create(createRoomDto, user);
  }

  @Get(':id')
  getClassRoomById(
    @Param('id', ParseUUIDPipe) classId: string,
    @CurrentUser() user: User,
  ) {
    return this.roomsService.findClassById(classId, user.id);
  }

  /**
   * Controller to generate Invite Code
   * @param classId
   * @param currentUser
   * @returns
   */
  @Patch(':id/generate')
  @ApiOperation({ summary: 'Generate Classroom Invite Code' })
  generate(@Param('id') classId: string, @CurrentUser() currentUser: User) {
    return this.roomsService.generateCode(classId, currentUser);
  }

  /**
   * Controller to remove class
   * @param classId
   * @param currentUser
   * @returns
   */
  @Delete(':id')
  async remove(@Param('id') classId: string, @CurrentUser() currentUser: User) {
    return this.roomsService.removeClass(classId, currentUser.id);
  }

  /**
   * Controller to join class based on invite code
   * @param inviteCode
   * @param currentUser
   * @returns
   */
  @Patch(':inviteCode/join')
  @ApiOperation({ summary: 'Join classroom' })
  joinClass(
    @Param('inviteCode') inviteCode: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.roomsService.joinClass(inviteCode, currentUser);
  }

  @Patch('/unenroll/:classId')
  unEnroll(
    @Param('classId') classId: string,
    @CurrentUser() currentUser: User,
  ) {
    console.log(`You're unenrolling ${classId}`);
    return this.roomsService.unEnroll(classId, currentUser);
  }
}
