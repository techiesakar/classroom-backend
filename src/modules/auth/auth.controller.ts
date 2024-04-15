import { Body, Controller, Get, HttpCode, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/meta-decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../users/dto/login-user.dto';

import { Response, } from 'express';
import { FileInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@ApiTags("Authentication")
@Controller('auth')
// @Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }


  @Post('login')
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginUserDto
  })
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }


  @Public()
  @Post('try')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar'))
  async try(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    return createUserDto
  }

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('classroom_token', '', {
      expires: new Date(Date.now())
    })
    return {
      "message": "Logout Successfully"
    }
  }

}
