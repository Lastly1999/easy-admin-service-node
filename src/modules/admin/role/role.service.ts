import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import SysRole from '../../../entity/admin/sys-role.entity';
import SysUserRoleEntity from 'src/entity/admin/sys-user-role.entity';
import { MenuService } from '../menu/menu.service';
import { UtilService } from '../../common/util/util.service';
import { CreateRoleMenusDto } from './dto/create-role-menus.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(SysRole)
        private readonly roleRepository: Repository<SysRole>,
        @InjectRepository(SysUserRoleEntity)
        private readonly sysUserRoleEntity: Repository<SysUserRoleEntity>,
        private readonly menuService: MenuService,
        private readonly utilService: UtilService,
    ) {}

    /**
     * 角色id 获取系统菜单
     * @param roleId
     */
    public async getRoleMenuList(roleId: string) {
        try {
            const menuList = await this.menuService.getMenusByRoleId(roleId);
            return this.utilService.toTree(menuList);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取系统角色列表
     */
    public async getRoleList() {
        try {
            return await this.roleRepository.find();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 新增角色
     * @param createRoleDto
     */
    public async addRole(createRoleDto: CreateRoleDto) {
        // 角色存在判断
        const existRole = await this.findRoleByRoleName(createRoleDto.roleName);
        if (existRole) {
            throw new HttpException('新增失败，该角色已存在', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            // 新增角色信息
            const addEffects = await this.roleRepository
                .createQueryBuilder()
                .insert()
                .into(SysRole)
                .values({
                    userId: createRoleDto.userId,
                    name: createRoleDto.userName,
                    label: createRoleDto.roleName,
                    remark: createRoleDto.roleRemark,
                })
                .execute();
            if (addEffects.raw.affectedRows > 0) {
                return null;
            } else {
                throw new HttpException('新增失败，服务器内部错误', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 查询角色 是否存在
     * @param roleName
     */
    public async findRoleByRoleName(roleName: string) {
        return await this.roleRepository.findOne({
            where: {
                name: roleName,
            },
        });
    }

    /**
     * 查询用户角色的id列表
     * @param userId
     * @returns
     */
    public async getUserRoleIds(userId: number): Promise<number[]> {
        const userRoles = await this.sysUserRoleEntity
            .createQueryBuilder('sysUserRole')
            .where('sysUserRole.userId = :id', {
                id: userId,
            })
            .getMany();
        if (userRoles) {
            return userRoles.map((item) => item.roleId);
        }
        return [];
    }

    /**
     * 创建角色菜单关联
     * @param roleId
     * @param createRoleMenusDto
     */
    public async createRoleMenus(roleId: string, createRoleMenusDto: CreateRoleMenusDto) {
        return this.menuService.createRoleMenus(Number(roleId), createRoleMenusDto.menuIds);
    }

    /**
     * 查询用户角色
     * @param userId
     */
    public async findUserRoles(userId: number) {
        return await this.sysUserRoleEntity.createQueryBuilder('user_role').where('user_role.user_id = :userId', { userId }).getMany();
    }
}
