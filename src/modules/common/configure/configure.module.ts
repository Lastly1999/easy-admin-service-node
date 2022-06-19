import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import developmentConfig from '../../../common/config/development.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [developmentConfig],
        }),
    ],
})
export class ConfigureModule {}
