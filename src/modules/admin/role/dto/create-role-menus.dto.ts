import { IsNotEmpty } from 'class-validator';

export class CreateRoleMenusDto {
    @IsNotEmpty()
    menuIds: number[];
}
