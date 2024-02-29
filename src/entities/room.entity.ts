import { BaseEntity } from "src/entities/base.entity";
import { User } from "src/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, Unique } from "typeorm";

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
}
