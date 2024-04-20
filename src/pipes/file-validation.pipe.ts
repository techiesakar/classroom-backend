import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly defaultAcceptedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ];

  constructor(
    private readonly acceptedTypes: string[] = [],
    private readonly fileIsRequired: boolean = true,
    private readonly fileSize: number = 2 * 1024 * 1024,
  ) {}

  async transform(value: Express.Multer.File | string | null | undefined) {
    if (
      this.fileIsRequired &&
      (typeof value === 'string' ||
        typeof value === 'undefined' ||
        value === null)
    ) {
      throw new BadRequestException('File is required');
    }

    if (!value && !this.fileIsRequired) {
      return value;
    }

    if (typeof value !== 'string') {
      // Check file size
      if (value.size > this.fileSize) {
        throw new NotAcceptableException('File is too large');
      }

      // Validate file type using magic number
      const fileType = await this.detectFileType(value);
      if (!fileType || !this.isValidType(fileType)) {
        console.log(fileType);
        throw new BadRequestException('Invalid file type');
      }
    }

    return value;
  }

  private async detectFileType(
    file: Express.Multer.File,
  ): Promise<string | null> {
    if (file.path) {
      const buffer = await this.readFileBuffer(file.path);
      if (!buffer) {
        return null;
      }
      return this.checkMagicNumber(buffer);
    }

    // If the file is in memory
    if (file.buffer) {
      return this.checkMagicNumber(file.buffer);
    }

    return null;
  }

  private async readFileBuffer(filePath: string): Promise<Buffer | null> {
    try {
      return fs.promises.readFile(filePath);
    } catch (err) {
      console.error('Error reading file:', err);
      return null;
    }
  }

  private checkMagicNumber(buffer: Buffer): string | null {
    if (buffer.length < 4) {
      return null;
    }

    const signatures = [
      { signature: [0xff, 0xd8, 0xff, 0xe0], type: 'image/jpeg' }, // JPEG
      { signature: [0xff, 0xd8, 0xff, 0xe1], type: 'image/jpeg' }, // JPEG
      { signature: [0x89, 0x50, 0x4e, 0x47], type: 'image/png' }, // PNG
      { signature: [0x47, 0x49, 0x46, 0x38], type: 'image/gif' }, // GIF
    ];

    for (const { signature, type } of signatures) {
      if (this.compareSignature(buffer, signature)) {
        return type;
      }
    }

    return null; // Unknown type
  }

  private compareSignature(buffer: Buffer, signature: number[]): boolean {
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  }

  private isValidType(fileType: string): boolean {
    const newAcceptedTypes = [
      ...this.defaultAcceptedTypes,
      ...this.acceptedTypes,
    ];
    return newAcceptedTypes.includes(fileType);
  }
}
