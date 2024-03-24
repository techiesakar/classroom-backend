import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { join } from 'path';
import { Announcement } from 'src/entities/announcement.entity';
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
                entities: [Announcement, Room, User, Comment],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService]
        }),
    ]
})
export class DatabaseModule {

}
