import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow<string>('DATABASE_HOST'),
                port: configService.getOrThrow<number>('DATABASE_PORT'),
                username: configService.getOrThrow<string>('DATABASE_USERNAME'),
                password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
                database: configService.getOrThrow<string>('DATABASE_NAME'),
                entities: [join(__dirname, '**', '*.entity.{ts,js}')],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService]
        }),
    ]
})
export class DatabaseModule {

}
