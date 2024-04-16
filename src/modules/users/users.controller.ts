import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiCookieAuth,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserResponseDto } from './dto/user-response-dto';
import { UsersService } from './users.service';
import { Public } from 'src/decorators/meta-decorator';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomResponseDto } from '../rooms/dto/room-dto';

export enum RoleType {
  teacher = 'teacher',
  student = 'student',
  all = 'all',
}

@Serialize(UserResponseDto)
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @ApiOperation({ summary: 'Get All users' })
  @Get()
  find() {
    return this.userService.findAll();
  }

  @Get('whoami')
  @ApiOperation({ summary: 'Find current loggedin user' })
  whoAmI(@CurrentUser() currentUser: User) {
    return this.userService.findOneById(currentUser.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update your profile - No Id required' })
  Update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    console.log(updateUserDto);
    return this.userService.updateUser(updateUserDto, currentUser);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Get('/room')
  @Serialize(RoomResponseDto)
  @ApiQuery({ name: 'type', enum: RoleType })
  findMyRoom(
    @Query('type') type: RoleType = RoleType.all,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.findRoomByUserId(currentUser.id, type);
  }
}
