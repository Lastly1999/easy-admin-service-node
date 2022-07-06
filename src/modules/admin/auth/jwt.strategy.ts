import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConstant } from './jwt.constant';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtConstant.JWT_SALT,
        });
    }

    async validate(payload: any) {
        Logger.log('-----------> 进行jwt验证 ------>', 'JwtStrategy');
        const user = await this.authService.validateUserByJwt(payload);
        // 如果有用户信息，代表 token 没有过期，没有则 token 已失效
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
