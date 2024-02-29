import { Room } from "src/entities/room.entity"
import { BaseEntity } from "src/entities/base.entity"
import { Entity, Column, OneToMany, Unique, ManyToMany } from "typeorm"

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    dob: string

    @Column({
        nullable: true
    })
    about: string

    @Column({ nullable: true })
    avatar: string

    @Column({ nullable: true })
    phone: string

    @OneToMany(() => Room, (room) => room.teacher, { nullable: true })
    classesTaught: Room[];

    @ManyToMany(() => Room, (room) => room.students)
    classesEnrolled: Room[]
}
