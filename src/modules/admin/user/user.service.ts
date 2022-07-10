import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { FindUserDto } from '../auth/dto/find-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import SysUser from '../../../entity/admin/sys-user.entity';
import SysUserRoleEntity from '../../../entity/admin/sys-user-role.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,
        @InjectEntityManager() private entityManager: EntityManager,
    ) {}

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
    public async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }
}
