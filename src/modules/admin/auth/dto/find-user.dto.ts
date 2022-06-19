import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserDto {
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
}
