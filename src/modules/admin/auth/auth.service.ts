import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FindUserDto } from './dto/find-user.dto';
import { UserService } from '../user/user.service';
import * as svgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';
import { AuthRedisConstant } from './auth-redis.constant';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    /**
     * 验证用户是否存在
     * @param findUserDto
     */
    async getUser(findUserDto: FindUserDto) {
        await this.userService.getUser(findUserDto);
        return null;
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
            await this.cacheManager.set('adjasjdjad', captcha.text, { ttl: 50000 });
            return {
                captchaBase64,
                captchaId: captcha.text,
            };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
