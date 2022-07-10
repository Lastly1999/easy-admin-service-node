import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({
        description: '角色名称',
    })
    readonly roleName: string;
    @IsNotEmpty()
    @ApiProperty({
        description: '备注',
    })
    readonly roleRemark: string;
}
