import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户模块')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put()
    public async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.addUser(createUserDto);
    }

    @Post()
    public async register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.registerUser(registerUserDto);
    }
}
