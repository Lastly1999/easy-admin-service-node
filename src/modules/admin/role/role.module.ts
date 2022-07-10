import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysRole from '../../../entity/admin/sys-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SysRole])],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {}
