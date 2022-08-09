import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysMenu from '../../../entity/admin/sys-menu.entity';
import { Repository } from 'typeorm';
import SysRoleMenu from '../../../entity/admin/sys-role-menu.entity';
import { UtilService } from '../../common/util/util.service';
import { GetMenusDto } from './dto/get-menus.dto';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(SysRoleMenu)
        private readonly SysRoleMenuRepository: Repository<SysRoleMenu>,
        @InjectRepository(SysMenu) private readonly sysMenuRepository: Repository<SysMenu>,
        private readonly utilService: UtilService,
    ) {}

    /**
     * 角色id获取系统关联的菜单
     * @param roleIds
     */
    public async findAuthMenusByRoleId(roleIds: number[]) {
        return await this.sysMenuRepository
            .createQueryBuilder('sysMenu')
            .leftJoinAndSelect(SysRoleMenu, 'sysRoleMenu', 'sysRoleMenu.menu_id = sysMenu.id')
            .where('sysRoleMenu.role_id IN (:...roleIds) AND sysMenu.is_show = 1', { roleIds })
            .addOrderBy('order_num', 'DESC')
            .getMany();
    }

    /**
     * 角色id 获取系统菜单列表
     * @param roleId
     */
    public async getMenusByRoleId(roleId: string) {
        return await this.sysMenuRepository
            .createQueryBuilder('sysMenu')
            .leftJoinAndSelect(SysRoleMenu, 'sysRoleMenu', 'sysRoleMenu.menu_id = sysMenu.id')
            .where('sysRoleMenu.role_id = :roleId AND sysMenu.is_show = 1', { roleId })
            .addOrderBy('order_num', 'DESC')
            .getMany();
    }

    /**
     * 获取系统权限菜单
     */
    public async getMenuList(): Promise<GetMenusDto[]> {
        const menuList = await this.sysMenuRepository.find();
        return this.utilService.toTree(menuList);
    }

    /**
     * 角色id 添加系统菜单 创建关联
     */
    public async createRoleMenus(roleId: number, menuIds: number[]) {
        try {
            const sysRoleMenu = menuIds.map((id) => ({
                roleId,
                menuId: id,
            }));
            await this.SysRoleMenuRepository.createQueryBuilder('sysRoleMenu').insert().into(SysRoleMenu).values(sysRoleMenu).execute();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 创建系统菜单
     * @param createMenuDto
     */
    public async createMenu(createMenuDto: CreateMenuDto) {
        return await this.sysMenuRepository
            .createQueryBuilder('sys_menu')
            .insert()
            .into(SysMenu)
            .values({
                icon: createMenuDto.menuIcon,
                isShow: createMenuDto.menuIsShow,
                name: createMenuDto.menuName,
                orderNum: createMenuDto.menuOrderNum,
                parentId: createMenuDto.menuPid,
                perms: createMenuDto.menuPerms,
                router: createMenuDto.menuRouter,
                type: createMenuDto.menuType,
            })
            .execute();
    }
}
