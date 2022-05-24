import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import { UserService } from '../user/user.service';
import * as svgCaptcha from 'svg-captcha';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

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
      return {
        captchaBase64,
        captchaId: captcha.text,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
