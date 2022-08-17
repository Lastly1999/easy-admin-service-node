import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
    @IsNotEmpty()
    @ApiProperty({
        description: '标识',
    })
    name: string;
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
    readonly roleDepIds: number[];
    readonly roleMenuIds: number[];
}
