import { BaseEntity } from "src/entities/base.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Unique } from "typeorm";
import { Announcement } from "./announcement.entity";

@Entity()
@Unique(["inviteCode"])
export class Room extends BaseEntity {
    @Column()
    name: string

    @Column()
    subject: string

    @Column({ nullable: true })
    inviteCode: string

    @ManyToOne(() => User, (user) => user.classesTaught)
    teacher: User;

    @ManyToMany(() => User, (user) => user.classesEnrolled, { nullable: true })
    @JoinTable()
    students: User[]

    @OneToMany(() => Announcement, announcement => announcement.room, { nullable: true })
    announcements: Announcement[]
}
