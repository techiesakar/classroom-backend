import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { AnnouncementComment } from "src/entities/announcement-comment.entity";
import { AssignmentComment } from "src/entities/assignment-comment.entity";
import { AnnouncementModule } from "../announcements/announcements.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, AnnouncementComment, AssignmentComment]), AnnouncementModule
    ],
    controllers: [CommentsController],
    providers: [CommentsService]
})

export class CommentsModule { }