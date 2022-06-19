import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) =>
                ({
                    type: configService.get<string>('database.type'),
                    host: configService.get<string>('database.host'),
                    username: configService.get<string>('database.username'),
                    password: configService.get<string>('database.password'),
                    database: configService.get<string>('database.database'),
                    entities: configService.get<string[]>('database.entities'),
                    synchronize: configService.get<boolean>('database.synchronize'),
                } as TypeOrmModuleOptions),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
