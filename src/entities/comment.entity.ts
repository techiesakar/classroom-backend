import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Announcement } from "./announcement.entity";
import { User } from "./user.entity";
import { Room } from "./room.entity";
import { Assignment } from "./assignment.entity";


@Entity()
export class Comment extends BaseEntity {
    @Column()
    title: string

    @ManyToOne(() => User, user => user.comments)
    user: User

    @ManyToOne(() => Room, room => room.comments)
    room: Room

    @ManyToOne(() => Announcement, announcement => announcement.comments)
    announcement: Announcement

    @ManyToOne(() => Assignment, assignment => assignment.comments)
    assignment: Assignment
}