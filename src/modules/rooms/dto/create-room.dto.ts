import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateRoomDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    subject: string
}
