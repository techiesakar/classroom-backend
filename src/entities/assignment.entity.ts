import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Room } from "./room.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Assignment extends BaseEntity {
    @Column()
    title: string

    @Column()
    description: string

    @ManyToOne(() => Room, room => room.assignments)
    room: Room

    @OneToMany(() => Comment, comment => comment.assignment)
    comments: Comment[]
}
