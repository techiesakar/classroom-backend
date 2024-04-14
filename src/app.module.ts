import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

import { DatabaseModule } from 'src/modules/database/database.module';
import { UsersModule } from 'src/modules/users/users.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AnnouncementModule } from './modules/announcements/announcements.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    RoomsModule,
    AuthModule,
    DatabaseModule,
    AnnouncementModule,
    CommentsModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
