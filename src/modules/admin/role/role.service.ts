import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import SysRole from '../../../entity/admin/sys-role.entity';
import SysUserRoleEntity from 'src/entity/admin/sys-user-role.entity';
import { MenuService } from '../menu/menu.service';
import { UtilService } from '../../common/util/util.service';
import { CreateRoleMenusDto } from './dto/create-role-menus.dto';
import SysRoleMenu from '../../../entity/admin/sys-role-menu.entity';
import SysRoleDepartment from '../../../entity/admin/sys-role-department.entity';
import { GetRoleInfoDto } from './dto/get-role-info.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(SysRole)
        private readonly roleRepository: Repository<SysRole>,
        @InjectRepository(SysUserRoleEntity)
        private readonly sysUserRoleEntity: Repository<SysUserRoleEntity>,
        @InjectRepository(SysRoleDepartment)
        private readonly sysRoleDepartmentRepository: Repository<SysRoleDepartment>,
        @InjectRepository(SysRoleMenu)
        private readonly sysRoleMenuRepository: Repository<SysRoleMenu>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
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
        try {
            const exist = await this.roleRepository.findOne({ where: { label: createRoleDto.roleName } });
            if (exist) {
                throw new HttpException('角色已存在', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            await this.entityManager.transaction(async (manage) => {
                // 添加角色至角色表
                const insertRoleInfo = manage.create(SysRole, {
                    userId: String(createRoleDto.userId),
                    name: createRoleDto.name,
                    remark: createRoleDto.roleRemark,
                    label: createRoleDto.roleName,
                });
                await manage.save(insertRoleInfo);
                // 插入角色菜单权限
                const insertRoleMenus = createRoleDto.roleMenuIds.map((menuId) => ({
                    roleId: insertRoleInfo.id,
                    menuId,
                }));
                await manage.insert(SysRoleMenu, insertRoleMenus);
                // 插入角色部门权限
                const insertRoleDeps = createRoleDto.roleDepIds.map((departmentId) => ({
                    roleId: insertRoleInfo.id,
                    departmentId,
                }));
                await manage.insert(SysRoleDepartment, insertRoleDeps);
            });
            return null;
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
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

    /**
     * 获取角色详情
     * @param roleId
     */
    public async getRoleInfoById(roleId: string): Promise<GetRoleInfoDto> {
        const roleInfo = await this.roleRepository.findOne({ where: { id: Number(roleId) } });
        if (!roleInfo) {
            throw new HttpException('角色不存在', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const roleMenus = await this.sysRoleMenuRepository.find({ where: { roleId: roleInfo.id } });
        const roleDeps = await this.sysRoleDepartmentRepository.find({ where: { roleId: roleInfo.id } });
        const roleMenuIds = roleMenus.map((item) => item.menuId);
        const roleDepIds = roleDeps.map((item) => item.departmentId);
        const roleInfoResult: GetRoleInfoDto = {
            userId: roleInfo.userId,
            name: roleInfo.name,
            roleName: roleInfo.label,
            roleRemark: roleInfo.remark,
            roleMenuIds,
            roleDepIds,
        };
        return roleInfoResult;
    }
}
