import { Module } from '@nestjs/common';
import { RedisStoreModule } from './common/redis-store/redis-store.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigureModule } from './common/configure/configure.module';
import {AdminModule} from "./admin/admin.module";
import {AuthGuard} from "@nestjs/passport";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./admin/core/guards/jwt-auth.guard";


@Module({
    imports: [
        ConfigureModule,
        DatabaseModule,
        RedisStoreModule,
        AdminModule
    ],
    exports:[AdminModule]
})
export class AppModule {}
