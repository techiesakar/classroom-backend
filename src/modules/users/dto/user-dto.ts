import { Expose } from 'class-transformer'
import { FileSystemStoredFile } from 'nestjs-form-data'

export class BasicUserDto {
    @Expose()
    id: string

    @Expose()
    name: string
}

export class UserResponseDto {
    @Expose()
    id: string

    @Expose()
    email: string

    @Expose()
    access_token: string

    @Expose()
    message: string

    @Expose()
    avatar: FileSystemStoredFile | string
}