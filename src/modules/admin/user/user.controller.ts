import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserListDto } from './dto/find-user-list.dto';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put()
    public async register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.registerUser(registerUserDto);
    }

    @Post()
    public async list(@Body() findUserListDto: FindUserListDto) {
        return this.userService.getUserList(findUserListDto);
    }

    @Get(':userId')
    public async info(@Param('userId') userId: string) {
        return this.userService.findUserById(Number(userId));
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
