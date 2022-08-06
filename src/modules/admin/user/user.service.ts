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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,
        @InjectEntityManager() private entityManager: EntityManager,
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
    public async getUserList() {
        const result = await this.userRepository
            .createQueryBuilder('user')
            .innerJoinAndSelect('sys_user_role', 'user_role', 'user_role.user_id = user.id')
            .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
            .getRawMany();
        const userList: FindUserListInterface[] = [];
        result.map((item) => {
            const index: number = userList.findIndex((listItem) => listItem.userId === item.user_id);
            if (index < 0) {
                userList.push({
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
        // const userList: FindUserListInterface[] = result.map((item) => ({
        //     departmentId: item.user_department_id,
        //     phone: item.user_phone,
        //     remark: item.user_remark,
        //     status: item.user_status,
        //     userName: item.user_username,
        //     nickName: item.user_nick_name,
        //     userId: item.user_id,
        //     name: item.user_name,
        //     headImg: item.user_head_img,
        //     createdAt: item.user_created_at,
        //     updatedAt: item.user_updated_at,
        // }));
        return userList;
    }

    /**
     * 更新用户信息
     * @param userId
     * @param updateUserDto
     */
    public async updateUserInfo(userId: string, updateUserDto: UpdateUserDto) {
        try {
            const userExist = await this.findUserById(Number(userId));
            if (!userExist) {
                throw new HttpException('该用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const result = await this.userRepository.update(userId, {
                username: updateUserDto.userName,
                email: updateUserDto.email,
                nickName: updateUserDto.nikeName,
                name: updateUserDto.name,
            });
            if (result.affected > 0) {
                return null;
            } else {
                throw new HttpException('新增失败', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return this.userRepository.update(userId, updateUserDto);
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
            const hashPassWord = await bcrypt.hash(registerUserDto.passWord, saltOrRounds);
            // 创建用户
            const user = manage.create(SysUser, {
                username: registerUserDto.userName,
                password: hashPassWord,
                email: registerUserDto.email,
                nickName: registerUserDto.nikeName,
                name: registerUserDto.name,
                departmentId: registerUserDto.depId,
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
    public async findUserById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }
}
