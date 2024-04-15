import { Expose } from "class-transformer"

export class CommentResponseDto {
    @Expose()
    id: string

    @Expose()
    title: string
}