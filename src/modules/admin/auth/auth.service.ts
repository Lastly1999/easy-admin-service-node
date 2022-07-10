import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FindUserDto } from './dto/find-user.dto';
import * as svgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';
import { AuthRedisConstant } from './auth-redis.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import SysUser from '../../../entity/admin/sys-user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 验证用户信息
     * @param findUserDto
     */
    public async validateUser(findUserDto: FindUserDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                username: findUserDto.userName,
            },
        });
        const hasExistUser = user && (await bcrypt.compare(findUserDto.passWord, user.password));
        if (hasExistUser) {
            const token = this.generateToken({ id: user.id });
            return { token, userInfo: user };
        } else {
            throw new HttpException('登录失败,请检查用户名或密码是否正确', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 生成图形验证码
     */
    public async generateCaptcha() {
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

    /**
     * 生成token
     */
    public generateToken(payload: any) {
        const accessToken = `Bearer ${this.jwtService.sign(payload)}`;
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '30m',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * token验证
     * @param token 0为验证成功返回token的id
     */
    public verifyToken(token: string): number {
        try {
            if (!token) return 0;
            const id = this.jwtService.verify(token.replace('Bearer ', ''));
            return id;
        } catch (e) {
            return 0;
        }
    }

    /**
     * 根据JWT解析的ID校验用户
     * @param payload
     */
    public async validateUserByJwt(payload: { id: number }): Promise<SysUser> {
        return await this.userRepository.findOne({ where: { id: payload.id } });
    }

    /**
     * 获取用户权限菜单
     */
    public async findUserAuthMenus(payload: { id: number }) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', {
                id: payload.id,
            })
            .innerJoinAndSelect('user.roles', 'roles')
            .getOne();
    }
}
