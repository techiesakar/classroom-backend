import { InjectRepository } from "@nestjs/typeorm";
import { AnnouncementComment } from "src/entities/announcement-comment.entity";
import { AssignmentComment } from "src/entities/assignment-comment.entity";
import { Comment } from "src/entities/comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment-dto";
import { User } from "src/entities/user.entity";
import { AnnouncementsService } from "../announcements/announcements.service";

export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        @InjectRepository(AnnouncementComment)
        private readonly announcementCommentRepo: Repository<AnnouncementComment>,
        @InjectRepository(AssignmentComment)
        private readonly assignmentCommentRepo: Repository<AssignmentComment>,
        private readonly announcementService: AnnouncementsService
    ) { }

    async createAssignComment(assignId: string, createCommentDto: CreateCommentDto, currentUser: User) {
        return "Assign"
    }

    async createAnnouncementComment(announceId: string, createCommentDto: CreateCommentDto, currentUser: User) {
        const announcement = await this.announcementService.findOne(announceId, currentUser.id)
        const comment = new Comment()
        Object.assign(comment, createCommentDto)
        comment.announcement = announcement
        comment.user = currentUser
        return this.commentRepo.save(comment)
    }

}