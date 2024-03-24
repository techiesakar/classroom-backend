import { Repository } from 'typeorm';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { User } from 'src/entities/user.entity';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class AnnouncementsService {
    constructor(
        @InjectRepository(Announcement)
        private readonly announcementRepo: Repository<Announcement>,
        private readonly roomService: RoomsService,
    ) { }

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

    async removeAnnouncement(announcementId: string, currentUser: User) {
        const userId = currentUser.id
        const queryBuilder = this.announcementRepo
            .createQueryBuilder('announcement')
            .leftJoinAndSelect('announcement.room', 'room')
            .leftJoinAndSelect('room.teacher', 'teacher')
            .where('announcement.id = :announcementId', { announcementId }) // Selecting only one announcement with provided ID
            .andWhere('teacher.id = :userId', { userId }) // To ensure only teacher can delete announcement

        const announcement = await queryBuilder.getOne()

        if (!announcement) {
            throw new NotFoundException()
        }
        return this.announcementRepo.remove(announcement)
    }
}
