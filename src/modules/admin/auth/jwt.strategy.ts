import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConstant } from './jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtConstant.JWT_SALT,
        });
    }

    async validate(payload: any) {
        Logger.log('-----------> 进行jwt验证 ------>', 'JwtStrategy');
        const info = payload.info;
        return {
            info,
        };
    }
}
