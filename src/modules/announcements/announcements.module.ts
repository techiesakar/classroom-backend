import { Module } from "@nestjs/common";
import { AnnouncementsController } from "./announcements.controller";
import { AnnouncementsService } from "./announcements.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Announcement } from "src/entities/announcement.entity";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
    imports: [TypeOrmModule.forFeature([Announcement]), RoomsModule],
    controllers: [AnnouncementsController],
    providers: [AnnouncementsService],
    exports: [AnnouncementsService]
})
export class AnnouncementModule { }