import { Controller, Get, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user-dto';
import { UsersService } from './users.service';
import { Public } from 'src/decorators/meta-decorator';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Serialize(UserDto)
@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Public()
  @ApiOperation({ summary: 'Get All users' })
  @Get()
  find() {
    return this.userService.findAll()
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Find current loggedin user" })
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser
  }
}
