import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { CreateUploadDto } from '../dto/create-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from 'src/entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload) private readonly uploadRepo: Repository<Upload>,
  ) {}
  create(
    file: Express.Multer.File | string | undefined,
    createUploadDto: CreateUploadDto,
  ) {
    if (!this.isMulterFile(file)) {
      throw new NotAcceptableException('Image is required');
    }
    const filteredData = {
      title: createUploadDto.title || file.originalname,
      alt: createUploadDto.alt || file.originalname,
      image: file.filename,
      mimeType: file.mimetype,
    };

    return this.uploadRepo.save(filteredData);
  }

  async findOne(imageId: string, res: any) {
    const image = await this.uploadRepo.findOne({
      where: {
        image: imageId,
      },
    });

    if (!image) {
      throw new NotFoundException("Image doesn't exist");
    }

    // Get the file path (assuming it's stored in the 'uploads' directory)
    const filePath = `uploads/${imageId}`;

    // Set the Content-Type based on the mimetype from the database
    let contentType = image.mimeType || 'application/octet-stream';

    // Set headers to indicate content type and inline display
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline`);

    // Stream the file to the response
    const stream = this.getFileStream(filePath);
    stream.pipe(res);
  }

  async findAll() {
    return await this.uploadRepo.find();
  }

  private isMulterFile(value: any): value is Express.Multer.File {
    return !!value && typeof value === 'object' && 'fieldname' in value;
  }

  private getFileStream(filePath: string): NodeJS.ReadableStream {
    const fs = require('fs');
    const path = require('path');
    return fs.createReadStream(path.resolve(filePath));
  }
}
