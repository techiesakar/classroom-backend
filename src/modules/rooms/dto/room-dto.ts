import { Expose, Transform } from "class-transformer";
import { User } from "src/entities/user.entity";

export class RoomDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    subject: string

    @Expose()
    inviteCode: string

}
