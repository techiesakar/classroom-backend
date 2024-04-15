import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { Comment } from './comment.entity';
import { Assignment } from './assignment.entity';

@Entity()
@Unique(['inviteCode'])
export class Room extends BaseEntity {
  @Column()
  name: string;

  @Column()
  subject: string;

  @Column({ nullable: true })
  inviteCode: string;

  @ManyToOne(() => User, (user) => user.classesTaught)
  teacher: User;

  @ManyToMany(() => User, (user) => user.classesEnrolled, { nullable: true })
  @JoinTable()
  students: User[];

  @OneToMany(() => Announcement, (announcement) => announcement.room, {
    nullable: true,
  })
  announcements: Announcement[];

  @OneToMany(() => Assignment, (assignment) => assignment.room, {
    nullable: true,
  })
  assignments: Assignment[];

  @OneToMany(() => Comment, (comment) => comment.room, { nullable: true })
  comments: Comment[];
}
