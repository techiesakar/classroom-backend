import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Announcement } from "./announcement.entity";
import { User } from "./user.entity";

@Entity()
export class Comment extends BaseEntity {
    @Column()
    title: string

    @ManyToOne(() => Announcement, announcement => announcement.comments)
    announcement: Announcement

    @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
    parentComment: Comment

    @OneToMany(() => Comment, comment => comment.parentComment, { cascade: true, onDelete: 'CASCADE' })
    replies: Comment[]

    @ManyToOne(() => User, user => user.comments)
    user: User

}