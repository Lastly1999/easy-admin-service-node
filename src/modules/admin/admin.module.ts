import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysRole from '../../entity/admin/sys-role.entity';
import sysUserRoleEntity from '../../entity/admin/sys-user-role.entity';
import SysMenu from '../../entity/admin/sys-menu.entity';
import SysRoleMenu from '../../entity/admin/sys-role-menu.entity';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import SysUser from '../../entity/admin/sys-user.entity';
import SysUserRoleEntity from '../../entity/admin/sys-user-role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from './admin.constant';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import SysDepartment from '../../entity/admin/sys-department.entity';
import SysRoleDepartment from '../../entity/admin/sys-role-department.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysUser, SysMenu, SysUserRoleEntity, SysRole, sysUserRoleEntity, SysMenu, SysRoleMenu, SysDepartment, SysRoleDepartment]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JwtConstant.JWT_SALT,
            signOptions: { expiresIn: '30m' },
        }),
    ],
    controllers: [AuthController, UserController, RoleController, MenuController, DepartmentController],
    providers: [JwtStrategy, PassportModule, JwtModule, AuthService, UserService, RoleService, MenuService, DepartmentService],
    exports: [TypeOrmModule, PassportModule, JwtModule, AuthService, UserService, RoleService, MenuService, DepartmentService],
})
export class AdminModule {}
