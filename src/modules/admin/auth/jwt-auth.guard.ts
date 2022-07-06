import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
        super();
    }

    public async canActivate(context) {
        // 获取响应请求
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        try {
            // accessToken 验证处理
            const accessToken = req.get('Authorization');
            if (!accessToken) throw new UnauthorizedException('请先登录');
            const aUserId = this.authService.verifyToken(accessToken);
            if (aUserId) return this.activate(context);
            // reToken 验证处理
            const refreshToken = req.get('RefreshToken');
            const rtUserId = this.authService.verifyToken(refreshToken);
            if (!rtUserId) throw new UnauthorizedException('当前登录已过期，请重新登录');
            // 查询用户
            const user = await this.userService.findById(rtUserId);
            // 续签操作
            if (user) {
                const tokens = await this.authService.generateToken({ id: rtUserId });
                req.headers['authorization'] = tokens.accessToken;
                req.headers['refreshtoken'] = tokens.refreshToken;
                res.header('Authorization', tokens.accessToken);
                res.header('RefreshToken', tokens.refreshToken);
                // 请求交付下级
                return this.activate(context);
            } else {
                throw new UnauthorizedException('用户不存在');
            }
        } catch (e) {
            return false;
        }
    }

    public async activate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context) as Promise<boolean>;
    }
}
