import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from 'src/entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
