import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AnnouncementResponseDto } from './dto/announcement-response.dto';

@ApiBearerAuth()
@Serialize(AnnouncementResponseDto)
@ApiTags('Announcement')
@UseGuards(JwtAuthGuard)
@Controller('announcement')
export class AnnouncementsController {
    constructor(private readonly announcementService: AnnouncementsService) { }
    @Post(':id/create')
    @ApiOperation({ summary: 'Create Announcement' })
    @HttpCode(HttpStatus.OK)
    create(
        @Param('id') classId: string,
        @Body() createAnnouncementDto: CreateAnnouncementDto,
        @CurrentUser() currentUser: User,
    ) {
        return this.announcementService.create(
            classId,
            createAnnouncementDto,
            currentUser,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single announcement of the particular room' })
    @HttpCode(HttpStatus.OK)
    findAnnouncements(
        @Param('id') announcementId: string,
        @CurrentUser() currentUser: User,
    ) {
        return this.announcementService.findOne(announcementId, currentUser.id);
    }

    @ApiOperation({ summary: 'Delete Announcement' })
    @Delete(':id')
    async remove(@Param('id') announcementId: string, @CurrentUser() currentUser: User) {
        return this.announcementService.removeAnnouncement(announcementId, currentUser);
    }
}
