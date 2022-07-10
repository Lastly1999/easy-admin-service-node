import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import SysRole from '../../../entity/admin/sys-role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(SysRole)
        private readonly roleRepository: Repository<SysRole>,
    ) {}

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
                    name: createRoleDto.roleName,
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
}
