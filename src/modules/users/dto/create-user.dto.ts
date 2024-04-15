import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";


export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    name: string

    @ApiProperty()
    @IsEmail()
    username: string

    @ApiProperty()
    @IsString()
    @Length(6, 30)
    password: string

}
