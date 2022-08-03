import { UtilModule } from './common/util/util.module';
import { Module } from '@nestjs/common';
import { RedisStoreModule } from './common/redis-store/redis-store.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigureModule } from './common/configure/configure.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [UtilModule, ConfigureModule, DatabaseModule, RedisStoreModule, AdminModule],
    exports: [AdminModule],
})
export class AppModule {}
