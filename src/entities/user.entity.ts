import { Room } from '../entities/room.entity';
import { BaseEntity } from '../entities/base.entity';
import { Entity, Column, OneToMany, Unique, ManyToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  dob: string;

  @Column({
    nullable: true,
  })
  about: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  school_college: string;

  @OneToMany(() => Room, (room) => room.teacher, { nullable: true })
  classesTaught: Room[];

  @ManyToMany(() => Room, (room) => room.students)
  classesEnrolled: Room[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
