import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";


export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    username: string

    @ApiProperty()
    @IsString()
    @Length(6, 30)
    password: string
}
