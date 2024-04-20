import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/entities/announcement.entity';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { User } from 'src/entities/user.entity';
import { RoomsService } from '../../rooms/services/rooms.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
    private readonly roomService: RoomsService,
  ) {}

  /**
   * Function to create announcement in a room
   * @param classId
   * @param createAnnouncementDto
   * @param currentUser
   * @returns announcement
   */

  async create(
    classId: string,
    createAnnouncementDto: CreateAnnouncementDto,
    currentUser: User,
  ) {
    const existingRoom = await this.roomService.findClassById(
      classId,
      currentUser.id,
    );

    if (!this.roomService.isTeacher(existingRoom, currentUser)) {
      throw new UnauthorizedException('Only teacher can create announcement');
    }

    const newAnnouncement = new Announcement();
    Object.assign(newAnnouncement, {
      room: existingRoom,
      ...createAnnouncementDto,
    });

    return await this.announcementRepo.save(newAnnouncement);
  }

  /**
   * Function to list all announcement in the room
   * @param classId
   * @param currentUser
   * @returns announcements
   */

  async findAll(classId: string, currentUser: User) {
    const existingRoom = await this.roomService.findClassById(
      classId,
      currentUser.id,
    );

    if (!existingRoom) {
      throw new NotFoundException('Room Not Found');
    }

    if (!this.roomService.isStudentOrTeacher(existingRoom, currentUser)) {
      throw new UnauthorizedException();
    }

    return existingRoom.announcements;
  }

  async findOne(announcementId: string, userId: string) {
    const queryBuilder = this.announcementRepo
      .createQueryBuilder('announcement')
      .leftJoin('announcement.room', 'room')
      .leftJoin('room.teacher', 'teacher')
      .leftJoin('room.students', 'student')
      .leftJoin('announcement.comments', 'comment')
      .leftJoin('comment.user', 'user')
      .select([
        'announcement.id',
        'announcement.title',
        'announcement.description',
        'announcement.updatedAt',
        'room.id',
        'room.name',
        'teacher.id',
        'teacher.name',
        'comment.id',
        'comment.title',
        'user.name',
        'user.id',
      ])
      .where('announcement.id = :announcementId', { announcementId })
      .andWhere('teacher.id = :userId OR student.id = :userId', { userId });
    const result = await queryBuilder.getOne();
    console.log(result);
    return result;
  }

  async removeAnnouncement(announcementId: string, currentUser: User) {
    const announcement = await this.findOne(announcementId, currentUser.id);

    if (!announcement || announcement?.room?.teacher?.id !== currentUser.id) {
      throw new UnauthorizedException();
    }

    return this.announcementRepo.remove(announcement);
  }

  async updateAnnouncement(announcementId: string, currentUser: User) {
    const announcement = this.findOne(announcementId, currentUser.id);
  }
}
