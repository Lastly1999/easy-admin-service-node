import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @IsNotEmpty()
    @ApiProperty({
        description: '用户名',
    })
    readonly userName: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '姓名',
    })
    readonly name: string;
    @ApiProperty({
        description: '密码',
    })
    readonly passWord: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '邮箱',
    })
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '昵称',
    })
    readonly nikeName: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '部门id',
    })
    readonly depId: number;
    @IsNotEmpty()
    @ApiProperty({
        description: '角色id',
    })
    roles: number[];
    @ApiProperty({
        description: '手机号',
    })
    phone: string;
}
