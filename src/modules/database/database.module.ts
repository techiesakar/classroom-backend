import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementComment } from 'src/entities/announcement-comment.entity';
// import { join } from 'path';
import { Announcement } from 'src/entities/announcement.entity';
import { AssignmentComment } from 'src/entities/assignment-comment.entity';
import { Assignment } from 'src/entities/assignment.entity';
import { Comment } from 'src/entities/comment.entity';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                url: configService.getOrThrow<string>('DATABASE_HOST'),
                // entities: [join(__dirname, '**', '*.entity.{ts}')],
                entities: [Announcement, Room, User, Comment, Assignment, AssignmentComment, AnnouncementComment],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService]
        }),
    ]
})
export class DatabaseModule {

}
