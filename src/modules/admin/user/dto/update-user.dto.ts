import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
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
    @IsNotEmpty()
    @ApiProperty({
        description: '用户名',
    })
    readonly phone: string;
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
        description: '邮箱',
    })
    readonly email: string;
    @ApiProperty({
        description: '昵称',
    })
    readonly nikeName: string;
}
