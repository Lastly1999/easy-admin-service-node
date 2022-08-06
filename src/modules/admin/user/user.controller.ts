import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    public async register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.registerUser(registerUserDto);
    }

    @Get()
    public async list() {
        return this.userService.getUserList();
    }

    @Patch(':userId')
    public async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUserInfo(userId, updateUserDto);
    }

    @Delete(':userId')
    public async delete(@Param('userId') userId: string) {
        return this.userService.deleteUserById(userId);
    }
}
