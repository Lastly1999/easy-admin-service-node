import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleMenusDto } from './dto/create-role-menus.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Put()
    public async create(@Body() createRoleDto: CreateRoleDto) {
        return await this.roleService.addRole(createRoleDto);
    }

    @Post()
    public async list() {
        return await this.roleService.getRoleList();
    }

    @Get(':roleId')
    public async info(@Param('roleId') roleId: string) {
        return await this.roleService.getRoleInfoById(roleId);
    }

    @Patch(':roleId')
    public async update(@Param('roleId') roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
        return await this.roleService.updateRoleInfo(roleId, updateRoleDto);
    }

    @Get('/menu/:roleId')
    public async getRoleMenus(@Param('roleId') roleId: string) {
        return await this.roleService.getRoleMenuList(roleId);
    }

    @Put('/menu/:roleId')
    public async createRoleMenus(@Param('roleId') roleId: string, @Body() createRoleMenusDto: CreateRoleMenusDto) {
        return await this.roleService.createRoleMenus(roleId, createRoleMenusDto);
    }
}
