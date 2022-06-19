import { Module } from '@nestjs/common';
import { UserModule } from './admin/user/user.module';
import { RoleModule } from './admin/role/role.module';
import { DepartmentModule } from './admin/department/department.module';
import { MenuModule } from './admin/menu/menu.module';
import { AuthModule } from './admin/auth/auth.module';
import { RedisStoreModule } from './common/redis-store/redis-store.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigureModule } from './common/configure/configure.module';

@Module({
    imports: [ConfigureModule, DatabaseModule, RedisStoreModule, UserModule, RoleModule, DepartmentModule, MenuModule, AuthModule],
})
export class AppModule {}
