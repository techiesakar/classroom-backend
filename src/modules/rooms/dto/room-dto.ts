import { Expose, Type } from 'class-transformer';
import { AnnouncementResponseDto } from '../../announcements/dto/announcement-response.dto';
import { BasicUserDto } from '../../users/dto/user-response-dto';

export class RoomResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  subject: string;

  @Expose()
  inviteCode: string;

  @Type(() => BasicUserDto)
  @Expose()
  teacher: BasicUserDto;

  @Type(() => BasicUserDto)
  @Expose()
  students: BasicUserDto[];

  @Type(() => AnnouncementResponseDto)
  @Expose()
  announcements: AnnouncementResponseDto[];
}
