import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { MenuModule } from './menu/menu.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import developmentConfig from '../common/config/development.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [developmentConfig],
        }),
        UserModule,
        RoleModule,
        DepartmentModule,
        MenuModule,
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
                    synchronize: configService.get<boolean>(
                        'database.synchronize',
                    ),
                } as TypeOrmModuleOptions),
            inject: [ConfigService],
        }),
        AuthModule,
    ],
})
export class AppModule {}
