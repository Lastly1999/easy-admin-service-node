import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../entity/user.entity';
import { FindUserDto } from '../auth/dto/find-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    /**
     * 用户注册
     * @param registerUserDto
     */
    async registerUser(registerUserDto: RegisterUserDto) {
        const saltOrRounds = 10;
        const hashPassWord = await bcrypt.hash(registerUserDto.passWord, saltOrRounds);
        await this.userRepository
            .createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values([
                {
                    userName: registerUserDto.userName,
                    passWord: hashPassWord,
                    email: registerUserDto.email,
                    nikeName: registerUserDto.nikeName,
                },
            ])
            .execute();
        return null;
    }

    /**
     * 查询用户
     * @param findUserDto
     */
    async getUser(findUserDto: FindUserDto) {
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
     * 新增用户
     * @param createUserDto
     */
    async addUser(createUserDto: CreateUserDto) {
        return await this.userRepository
            .createQueryBuilder('user')
            .insert()
            .into(UserEntity)
            .values({
                userName: createUserDto.userName,
                passWord: createUserDto.passWord,
                email: createUserDto.email,
                nikeName: createUserDto.nikeName,
            })
            .execute();
    }
}
