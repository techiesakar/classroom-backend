import { Expose } from 'class-transformer';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class BasicUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  access_token: string;

  @Expose()
  message: string;

  @Expose()
  school_college: string;

  @Expose()
  avatar: FileSystemStoredFile | string;
}
