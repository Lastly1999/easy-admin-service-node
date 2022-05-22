import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../../common/entity/user.entity';
import { FindUserDto } from '../auth/dto/find-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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