import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/meta-decorator';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';
import { CreateUploadDto } from '../dto/create-upload.dto';
import { MulterStorage } from 'src/helpers/multer-storage';

@Public()
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('image', { storage: MulterStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Image',
    type: CreateUploadDto,
  })
  uploadSingleFileAndPassValidation(
    @Body() createUploadDto: CreateUploadDto,
    @UploadedFile(new FileValidationPipe([], false))
    file: Express.Multer.File | string | undefined,
  ) {
    return this.uploadService.create(file, createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':imageId')
  findOne(@Param('imageId') imageId: string, @Res() res) {
    return this.uploadService.findOne(imageId, res);
  }
}
