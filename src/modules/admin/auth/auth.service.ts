import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FindUserDto } from './dto/find-user.dto';
import * as svgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';
import { AuthRedisConstant } from './auth-redis.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    /**
     * 验证用户信息
     * @param findUserDto
     */
    async validateUser(findUserDto: FindUserDto): Promise<any> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.userName = :userName', {
                userName: findUserDto.userName,
            })
            .andWhere('user.passWord = :passWord', {
                passWord: findUserDto.passWord,
            })
            .getOne();
        const hasExistUser = user && (await bcrypt.compare(findUserDto.passWord, user.passWord));
        if (hasExistUser) {
            return user;
        } else {
            throw new HttpException('登录失败', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 生成图形验证码
     */
    async generateCaptcha() {
        try {
            // 创建图形验证码
            const captcha = svgCaptcha.createMathExpr({ ...this.configService.get('svgcaptcha') });
            // svg转换为base64编码
            const captchaBase64 = Buffer.from(captcha.data).toString('base64');
            // 设置验证码缓存 3分钟过期
            await this.cacheManager.set(AuthRedisConstant.CAPTCHA_PREFIX, captcha.text, { ttl: 300 });
            return {
                captchaBase64,
                captchaId: captcha.text,
            };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
