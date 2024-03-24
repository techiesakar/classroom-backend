import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Room } from "./room.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Announcement extends BaseEntity {
    @Column()
    title: string

    @Column()
    description: string

    @ManyToOne(() => Room, room => room.announcements)
    room: Room

    @OneToMany(() => Comment, comment => comment.announcement, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    comments: Comment[]
}