import { Body, Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.addUser(createUserDto);
    }

    @Post()
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.registerUser(registerUserDto);
    }
}
