import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                url: configService.getOrThrow<string>('DATABASE_HOST'),
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
