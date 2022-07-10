import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysUser from '../../../entity/admin/sys-user.entity';
import SysUserRoleEntity from '../../../entity/admin/sys-user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SysUser, SysUserRoleEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
