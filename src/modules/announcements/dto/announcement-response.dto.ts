import { Expose, Type } from "class-transformer";
import { CommentResponseDto } from "src/modules/comments/dto/comment-response-dto";
import { RoomResponseDto } from "src/modules/rooms/dto/room-dto";

export class AnnouncementResponseDto {
    @Expose()
    id: string

    @Expose()
    title: string

    @Expose()
    description: string

    @Expose()
    updatedAt: string

    @Type(() => RoomResponseDto)
    @Expose()
    room: RoomResponseDto

    @Type(() => CommentResponseDto)
    @Expose()
    comments: CommentResponseDto[]
}