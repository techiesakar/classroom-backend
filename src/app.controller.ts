import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/meta-decorator';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags("Default")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly configService: ConfigService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('try')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  async try(@UploadedFile() file: Express.Multer.File) {
    return "hey"
  }

}
