import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { FindUserDto } from '../auth/dto/find-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import SysUser from '../../../entity/admin/sys-user.entity';
import SysUserRoleEntity from '../../../entity/admin/sys-user-role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserListInterface } from './interfaces/find-user-list.interface';
import { FindUserListDto } from './dto/find-user-list.dto';
import { FindUserInfoInterface } from './interfaces/find-user-info.interface';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,
        @InjectEntityManager() private entityManager: EntityManager,
        private readonly roleService: RoleService,
    ) {}

    /**
     * 删除用户
     * @param userId
     */
    public async deleteUserById(userId: string) {
        try {
            const userExist = await this.findUserById(Number(userId));
            if (!userExist) {
                throw new HttpException('该用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            await this.userRepository.update(userId, {
                status: 0,
            });
            return null;
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取系统用户列表
     */
    public async getUserList(findUserListDto: FindUserListDto) {
        const result = await this.userRepository
            .createQueryBuilder('user')
            .innerJoinAndSelect('sys_department', 'dept', 'dept.id = user.department_id')
            .innerJoinAndSelect('sys_user_role', 'user_role', 'user_role.user_id = user.id')
            .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
            .where(!findUserListDto?.depId ? '1 = 1' : 'user.department_id = :depId', {
                depId: findUserListDto.depId,
            })
            .getRawMany();
        const userList: FindUserListInterface[] = [];
        result.map((item) => {
            const index: number = userList.findIndex((listItem) => listItem.userId === item.user_id);
            if (index < 0) {
                userList.push({
                    email: item.user_email,
                    departmentName: item.dept_name,
                    departmentId: item.user_department_id,
                    phone: item.user_phone,
                    remark: item.user_remark,
                    status: item.user_status,
                    userName: item.user_username,
                    nickName: item.user_nick_name,
                    userId: item.user_id,
                    name: item.user_name,
                    headImg: item.user_head_img,
                    createdAt: item.user_created_at,
                    updatedAt: item.user_updated_at,
                    roles: [
                        {
                            roleId: item.role_id,
                            roleName: item.role_label,
                        },
                    ],
                });
            } else {
                userList[index].roles.push({
                    roleId: item.role_id,
                    roleName: item.role_label,
                });
            }
        });
        return userList;
    }

    /**
     * 更新用户信息
     * @param userId
     * @param updateUserDto
     */
    public async updateUserInfo(userId: string, updateUserDto: UpdateUserDto) {
        await this.entityManager.transaction(async (manage) => {
            await manage.update(SysUser, userId, {
                username: updateUserDto.userName,
                email: updateUserDto.email,
                nickName: updateUserDto.nikeName,
                name: updateUserDto.name,
                departmentId: updateUserDto.depId,
                phone: updateUserDto.phone,
            });
            // 删除角色关系
            await manage.delete(SysUserRoleEntity, { userId });
            // 生成角色用户映射关系
            const insertRoles = updateUserDto.roles.map((item) => ({
                userId: Number(userId),
                roleId: item,
            }));
            await manage.insert(SysUserRoleEntity, insertRoles);
        });
    }

    /**
     * 用户注册
     * @param registerUserDto
     */
    public async registerUser(registerUserDto: RegisterUserDto) {
        // 用户存在查询
        const existUser = await this.userRepository.findOne({
            where: {
                username: registerUserDto.userName,
            },
        });
        if (existUser) throw new HttpException('用户已存在', HttpStatus.OK);

        // 开始注册事务
        await this.entityManager.transaction(async (manage) => {
            const saltOrRounds = 10;
            const hashPassWord = await bcrypt.hash(registerUserDto?.passWord || '1234', saltOrRounds);
            // 创建用户
            const user = manage.create(SysUser, {
                username: registerUserDto.userName,
                password: hashPassWord,
                email: registerUserDto.email,
                nickName: registerUserDto.nikeName,
                name: registerUserDto.name,
                departmentId: registerUserDto.depId,
                phone: registerUserDto.phone,
            });
            // 保存操作
            const saveResult = await manage.save(user);
            // 插入用户角色
            const { roles } = registerUserDto;
            const insertRoles = roles.map((item) => ({ roleId: item, userId: saveResult.id }));
            await manage.insert(SysUserRoleEntity, insertRoles);
        });
    }

    /**
     * 查询用户
     * @param findUserDto
     */
    public async getUser(findUserDto: FindUserDto) {
        const userInfo = await this.userRepository
            .createQueryBuilder('user')
            .where('user.userName = :userName', {
                userName: findUserDto.userName,
            })
            .andWhere('user.passWord = :passWord', {
                passWord: findUserDto.passWord,
            })
            .getOne();
        if (!userInfo) {
            throw new HttpException('暂无用户', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return userInfo;
    }

    /**
     * 查询用户信息 (userId)
     * @param id
     */
    public async findUserById(id: number): Promise<FindUserInfoInterface> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            // 查询用户角色列表
            const userRoles = await this.roleService.findUserRoles(user.id);
            const roleIds: number[] = userRoles.map((item) => item.roleId);
            const resultInfo: FindUserInfoInterface = {
                depId: user.departmentId,
                email: user.email,
                headImg: user.headImg,
                id: user.id,
                name: user.name,
                nickName: user.nickName,
                phone: user.phone,
                remark: user.remark,
                status: user.status,
                userName: user.username,
                roles: roleIds,
            };
            return resultInfo;
        } catch (err) {
            throw new HttpException('内部服务异常', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
