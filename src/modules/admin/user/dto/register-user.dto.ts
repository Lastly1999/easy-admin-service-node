import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @IsNotEmpty()
    @ApiProperty({
        description: '用户名',
    })
    userName: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '密码',
    })
    passWord: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '邮箱',
    })
    email: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '昵称',
    })
    nikeName: string;
}
