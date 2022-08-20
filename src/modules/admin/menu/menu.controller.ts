import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Post()
    public async list() {
        return this.menuService.getMenuList();
    }

    @Put()
    public async create(@Body() createMenuDto: CreateMenuDto) {
        return await this.menuService.createMenu(createMenuDto);
    }

    @Delete(':menuId')
    public async delete(@Param('menuId') menuId: string) {
        return await this.menuService.deleteMenuById(menuId);
    }

    @Get(':menuId')
    public async info(@Param('menuId') menuId: string) {
        return await this.menuService.getMenuInfoById(menuId);
    }

    @Patch(':menuId')
    public async update(@Param('menuId') menuId: string, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menuService.updateMenu(menuId, updateMenuDto);
    }
}
