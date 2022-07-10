import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FindUserDto } from './dto/find-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('授权')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    public async loginAction(@Body() findUserDto: FindUserDto) {
        return this.authService.validateUser(findUserDto);
    }
    @Get('/captcha')
    public async getCaptcha() {
        return this.authService.generateCaptcha();
    }
    @Get('/menus')
    @UseGuards(AuthGuard('jwt'))
    public async getAUthMenus(@Request() request) {
        return await this.authService.findUserAuthMenus(request.user);
    }
}
