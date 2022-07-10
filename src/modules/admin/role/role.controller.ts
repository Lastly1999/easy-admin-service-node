import { Body, Controller, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Put()
    public async putRole(@Body() createRoleDto: CreateRoleDto) {
        return await this.roleService.addRole(createRoleDto);
    }
}
