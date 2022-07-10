import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from './jwt.constant';
import { JwtStrategy } from './jwt.strategy';
import SysUser from '../../../entity/admin/sys-user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysUser]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JwtConstant.JWT_SALT,
            signOptions: { expiresIn: '30m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
