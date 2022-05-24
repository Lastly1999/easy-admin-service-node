import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FindUserDto } from './dto/find-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async loginAction(@Body() findUserDto: FindUserDto) {
    return this.authService.getUser(findUserDto);
  }
  @Get('/captcha')
  async getCaptcha() {
    return this.authService.generateCaptcha();
  }
}
