import { ManyToOne } from "typeorm";
import { Comment } from "./comment.entity";
import { Announcement } from "./announcement.entity";

export class AnnouncementComment {
    @ManyToOne(() => Comment, comment => comment.announcement)
    comment: Comment

    @ManyToOne(() => Announcement, announcement => announcement.comments)
    announcement: Announcement
}