import { Expose } from 'class-transformer'
import { FileSystemStoredFile } from 'nestjs-form-data'

export class UserDto {
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