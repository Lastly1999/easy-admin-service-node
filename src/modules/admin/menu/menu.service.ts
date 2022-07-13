import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import SysMenu from "../../../entity/admin/sys-menu.entity";
import {Repository} from "typeorm";
import SysRoleMenu from "../../../entity/admin/sys-role-menu.entity";

@Injectable()
export class MenuService {
    constructor(@InjectRepository(SysMenu) private readonly sysMenuRepository:Repository<SysMenu>) {
    }

    /**
     * 角色id获取系统关联的菜单
     * @param roleIds
     */
    public async findAuthMenusByRoleId(roleIds:number[]){
        return  await this.sysMenuRepository
            .createQueryBuilder("sysMenu")
            .leftJoinAndSelect(SysRoleMenu,"sysRoleMenu","sysRoleMenu.menu_id = sysMenu.id")
            .where("sysRoleMenu.role_id IN (:...roleIds) AND sysMenu.is_show = 1",{roleIds})
            .addOrderBy("order_num","DESC")
            .getMany()
    }
}
