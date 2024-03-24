import { Expose } from "class-transformer";

export class AnnouncementResponseDto {
    @Expose()
    id: string

    @Expose()
    title: string

    @Expose()
    description: string
    @Expose()
    updatedAt: string

}